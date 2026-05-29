import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { addTime } from '@shared/utils/date/add-time';
import { createAuthConfig } from '@config/auth.config';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';

import { LoginDto } from '../dto/login.dto';
import { RequestMetadataDto } from '../dto/request-metadata.dto';
import { HashService } from '../contracts/hash-service.contract';
import { AccessTokenService } from '../contracts/access-token-service.contract';
import { RefreshTokenService } from '../contracts/refresh-token-service.contract';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly hashService: HashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly env: EnvService,
    ) {}

    private get authConfig() {
        return createAuthConfig(this.env);
    }

    async execute(dto: LoginDto, metadata: RequestMetadataDto) {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw AuthErrors.invalidCredentials();
        }

        const isValidPassword = await this.hashService.compare(
            dto.password,
            user.getPassword(),
        );

        if (!isValidPassword) {
            throw AuthErrors.invalidCredentials();
        }

        if (!user.isActive) {
            throw AuthErrors.accountDisabled();
        }

        if (this.authConfig.emailVerificationEnabled && !user.isVerified) {
            throw AuthErrors.emailNotVerified();
        }

        const sessionId = randomUUID();

        const payload = {
            sub: user.id,
            sessionId,
        };
        const refreshToken = await this.refreshTokenService.generate(payload);

        const refreshTokenHash = await this.hashService.hash(refreshToken);

        const session = user.createSession({
            sessionId: sessionId,
            refreshTokenHash,

            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,

            expiresAt: addTime(this.authConfig.refreshTokenExpiresIn),
        });

        await this.sessionRepository.save(session);

        const accessToken = await this.accessTokenService.generate(payload);

        return {
            accessToken,
            refreshToken,
        };
    }
}
