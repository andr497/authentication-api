import { Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { TokenService } from '../contracts/token-service.contract';
import { HashService } from './../../infrastructure/services/hash.service';
import { InvalidCredentialsError } from '../../domain/errors/auth-exceptions.error';
import { randomUUID } from 'crypto';
import { Session } from '../../domain/entities/session.entity';
import { authConfig } from '../../infrastructure/config/auth.config';
import { addTime } from '@src/shared/utils/date/add-time';
import { RequestMetadataDto } from '../dto/request-metadata.dto';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly tokenService: TokenService,
        private hashService: HashService,
    ) {}

    async execute(dto: RefreshTokenDto, metadata: RequestMetadataDto) {
        const payload = await this.tokenService.verifyRefreshToken(
            dto.refreshToken,
        );

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

        const refreshToken = await this.tokenService.generateRefreshToken(
            payload.sub,
            newSessionId,
        );

        const refreshTokenHash = await this.hashService.hash(refreshToken);

        const newSession = Session.create({
            id: newSessionId,
            userId: payload.sub,
            refreshTokenHash,

            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,

            expiresAt: addTime(authConfig.refreshTokenExpiresIn),
        });

        await this.sessionRepository.save(newSession);

        const accessToken = await this.tokenService.generateAccessToken(
            payload.sub,
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}
