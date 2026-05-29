import { Injectable } from '@nestjs/common';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { TransactionManager } from '@src/shared/application/contracts/transaction-manager.contract';
import { EmailVerificationRepository } from '@modules/auth/domain/repositories/email-verification.repository';

import { VerifyEmailDto } from '../dto/verify-email.dto';
import { HashService } from '../contracts/hash-service.contract';

@Injectable()
export class VerifyEmailUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly hashService: HashService,
        private readonly transaction: TransactionManager,
    ) {}

    async execute(dto: VerifyEmailDto) {
        const verification =
            await this.emailVerificationRepository.findLatestByUserId(
                dto.userId,
            );

        if (!verification) {
            throw AuthErrors.invalidToken();
        }

        if (verification.isUsed()) {
            throw AuthErrors.invalidToken('Token is already used');
        }

        if (verification.isExpired()) {
            throw AuthErrors.invalidToken('Token is expired');
        }

        const matches = await this.hashService.compare(
            dto.token,
            verification.tokenHash,
        );

        if (!matches) {
            throw AuthErrors.invalidToken();
        }

        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw AuthErrors.invalidToken();
        }

        await this.transaction.run(async () => {
            user.verifyEmail();
            await this.userRepository.update(user);
            verification.markAsUsed();
            await this.emailVerificationRepository.update(verification);
        });
    }
}
