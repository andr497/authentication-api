import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { addTime } from '@shared/utils/date/add-time';
import { createAuthConfig } from '@config/auth.config';
import { User } from '@modules/auth/domain/entities/user.entity';
import { Email } from '@modules/auth/domain/value-objects/email.vo';
import { Password } from '@modules/auth/domain/value-objects/password.vo';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { EmailVerification } from '@modules/auth/domain/entities/email-verification.entity';
import { EmailVerificationRepository } from '@modules/auth/domain/repositories/email-verification.repository';

import { RegisterDto } from '../dto/register.dto';
import { VerificationEmailService } from './../services/verification-email.service';

@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly verificationEmailService: VerificationEmailService,
        private readonly hashService: HashService,
        private readonly env: EnvService,
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
            password: hashedPassword,
        });

        let verification: EmailVerification | null = null;
        let verificationToken: string | null = null;

        if (this.authConfig.emailVerificationEnabled) {
            verificationToken = randomUUID();
            const tokenHash = await this.hashService.hash(verificationToken);

            verification = EmailVerification.create({
                id: randomUUID(),
                userId: user.id,
                tokenHash,
                expiresAt: addTime('1h'),
            });
        }

        await this.userRepository.save(user);

        if (verification) {
            await this.emailVerificationRepository.save(verification);
        }

        if (verification && verificationToken) {
            await this.verificationEmailService.send(
                user.email.getValue(),
                verificationToken,
                user.id,
            );
        }

        return user;
    }
}
