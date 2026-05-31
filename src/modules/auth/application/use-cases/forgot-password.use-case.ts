import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { addTime } from '@shared/utils/date/add-time';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { PasswordResetRepository } from '@modules/auth/domain/repositories/password-reset.repository';

import { HashService } from '../contracts/hash-service.contract';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly hashService: HashService,
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) return;

        const token = randomUUID();
        const tokenHash = await this.hashService.hash(token);

        const reset = user.createPasswordReset({
            resetId: randomUUID(),
            tokenHash,
            expiresAt: addTime('1h'),
        });

        await this.passwordResetRepository.save(reset);
    }
}
