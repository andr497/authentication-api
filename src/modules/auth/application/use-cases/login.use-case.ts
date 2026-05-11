import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { addTime } from '@src/shared/utils/date/add-time';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { createAuthConfig } from '@modules/auth/infrastructure/config/auth.config';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { AccessTokenService } from '@modules/auth/application/contracts/access-token-service.contract';
import { RefreshTokenService } from '@modules/auth/application/contracts/refresh-token-service.contract';

import { LoginDto } from '../dto/login.dto';
import { RequestMetadataDto } from '../dto/request-metadata.dto';
import { ConfigService } from '@nestjs/config';
import { AuthErrors } from '../../domain/errors/auth-error.factory';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly hashService: HashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly config: ConfigService,
    ) {}

    private get authConfig() {
        return createAuthConfig(this.config);
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

        const sessionId = randomUUID();

        const payload = {
            sub: user.id,
            sessionId,
        };
        const refreshToken = await this.refreshTokenService.generate(payload);

        const refreshTokenHash = await this.hashService.hash(refreshToken);

        const session = Session.create({
            id: sessionId,
            userId: user.id,
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
