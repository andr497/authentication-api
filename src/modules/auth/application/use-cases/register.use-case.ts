import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { addTime } from '@shared/utils/date/add-time';
import { createAuthConfig } from '@config/auth.config';
import { User } from '@modules/auth/domain/entities/user.entity';
import { Email } from '@modules/auth/domain/value-objects/email.vo';
import { Password } from '@modules/auth/domain/value-objects/password.vo';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';
import { EventBus } from '@shared/application/contracts/event-bus.contract';
import { UserRegisteredEvent } from '@modules/auth/domain/events/user-registered.event';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { HashedPassword } from '@modules/auth/domain/value-objects/hashed-password.vo';
import { TransactionManager } from '@shared/application/contracts/transaction-manager.contract';
import { EmailVerificationRepository } from '@modules/auth/domain/repositories/email-verification.repository';

import { RegisterDto } from '../dto/register.dto';
import { HashService } from '../contracts/hash-service.contract';
import { VerificationEmailService } from '../services/verification-email.service';

@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly verificationEmailService: VerificationEmailService,
        private readonly hashService: HashService,
        private readonly env: EnvService,
        private readonly eventBus: EventBus,
        private readonly transaction: TransactionManager,
    ) {}

    private get authConfig() {
        return createAuthConfig(this.env);
    }

    async execute(dto: RegisterDto): Promise<User> {
        const email = Email.create(dto.email);
        const password = Password.create(dto.password);

        const existingUser = await this.userRepository.findByEmail(
            email.getValue(),
        );

        if (existingUser) {
            throw AuthErrors.userAlreadyExists();
        }

        const hashedPassword = await this.hashService.hash(password.getValue());

        const user = User.create({
            id: randomUUID(),
            email,
            password: HashedPassword.create(hashedPassword),
        });

        if (this.authConfig.emailVerificationEnabled) {
            const verificationToken = randomUUID();
            const tokenHash = await this.hashService.hash(verificationToken);

            const verification = user.createEmailVerification({
                verificationId: randomUUID(),
                tokenHash,
                expiresAt: addTime('1h'),
            });

            user.pullDomainEvents();
            user.addDomainEvent(
                new UserRegisteredEvent(
                    user.id,
                    user.email.getValue(),
                    verificationToken,
                ),
            );

            await this.transaction.run(async () => {
                await this.userRepository.save(user);
                await this.emailVerificationRepository.save(verification);
            });

            await this.eventBus.publish(user.pullDomainEvents());
        } else {
            user.verifyEmail();

            await this.transaction.run(async () => {
                await this.userRepository.save(user);
            });

            await this.eventBus.publish(user.pullDomainEvents());
        }

        return user;
    }
}
