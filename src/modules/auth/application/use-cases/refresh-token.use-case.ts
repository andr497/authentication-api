import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { addTime } from '@shared/utils/date/add-time';
import { createAuthConfig } from '@config/auth.config';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RequestMetadataDto } from '../dto/request-metadata.dto';
import { HashService } from '../contracts/hash-service.contract';
import { AuthErrors } from '../../domain/errors/auth-error.factory';
import { AccessTokenService } from '../contracts/access-token-service.contract';
import { RefreshTokenService } from '../contracts/refresh-token-service.contract';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private hashService: HashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly env: EnvService,
    ) {}

    private get authConfig() {
        return createAuthConfig(this.env);
    }

    async execute(dto: RefreshTokenDto, metadata: RequestMetadataDto) {
        const payload = await this.refreshTokenService.verify(dto.refreshToken);

        const currentSession = await this.sessionRepository.findById(
            payload.sessionId,
        );

        if (!currentSession) {
            throw AuthErrors.invalidCredentials();
        }

        if (currentSession.revokedAt) {
            throw AuthErrors.invalidCredentials();
        }

        if (currentSession.expiresAt < new Date()) {
            throw AuthErrors.invalidCredentials();
        }

        const matches = await this.hashService.compare(
            dto.refreshToken,
            currentSession.getRefreshTokenHash(),
        );

        if (!matches) {
            throw AuthErrors.invalidCredentials();
        }

        await this.sessionRepository.revoke(currentSession.id);

        const newSessionId = randomUUID();

        const newPayload = {
            sub: payload.sub,
            sessionId: newSessionId,
        };
        const refreshToken =
            await this.refreshTokenService.generate(newPayload);

        const refreshTokenHash = await this.hashService.hash(refreshToken);

        const newSession = Session.create({
            id: newSessionId,
            userId: payload.sub,
            refreshTokenHash,

            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,

            expiresAt: addTime(this.authConfig.refreshTokenExpiresIn),
        });

        await this.sessionRepository.save(newSession);

        const accessToken = await this.accessTokenService.generate(newPayload);

        return {
            accessToken,
            refreshToken,
        };
    }
}
