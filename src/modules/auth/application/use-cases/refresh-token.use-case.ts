import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { addTime } from '@src/shared/utils/date/add-time';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { createAuthConfig } from '@modules/auth/infrastructure/config/auth.config';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { InvalidCredentialsError } from '@modules/auth/domain/errors/auth-exceptions.error';
import { AccessTokenService } from '@modules/auth/application/contracts/access-token-service.contract';
import { RefreshTokenService } from '@modules/auth/application/contracts/refresh-token-service.contract';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RequestMetadataDto } from '../dto/request-metadata.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private hashService: HashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly config: ConfigService,
    ) {}

    private get authConfig() {
        return createAuthConfig(this.config);
    }

    async execute(dto: RefreshTokenDto, metadata: RequestMetadataDto) {
        const payload = await this.refreshTokenService.verify(dto.refreshToken);

        const currentSession = await this.sessionRepository.findById(
            payload.sessionId,
        );

        if (!currentSession) {
            throw new InvalidCredentialsError();
        }

        if (currentSession.revokedAt) {
            throw new InvalidCredentialsError();
        }

        if (currentSession.expiresAt < new Date()) {
            throw new InvalidCredentialsError();
        }

        const matches = await this.hashService.compare(
            dto.refreshToken,
            currentSession.getRefreshTokenHash(),
        );

        if (!matches) {
            throw new InvalidCredentialsError();
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
