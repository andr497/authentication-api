import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { addTime } from '@src/shared/utils/date/add-time';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { authConfig } from '@modules/auth/infrastructure/config/auth.config';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { TokenService } from '@modules/auth/application/contracts/token-service.contract';
import { InvalidCredentialsError } from '@modules/auth/domain/errors/auth-exceptions.error';
import { LoginDto } from '../dto/login.dto';
import { RequestMetadataDto } from '../dto/request-metadata.dto';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
    ) {}

    async execute(dto: LoginDto, metadata: RequestMetadataDto) {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isValidPassword = await this.hashService.compare(
            dto.password,
            user.getPassword(),
        );

        if (!isValidPassword) {
            throw new InvalidCredentialsError();
        }

        const sessionId = randomUUID();

        const refreshToken = await this.tokenService.generateRefreshToken(
            user.id,
            sessionId,
        );

        const refreshTokenHash = await this.hashService.hash(refreshToken);

        const session = Session.create({
            id: sessionId,
            userId: user.id,
            refreshTokenHash,

            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,

            expiresAt: addTime(authConfig.refreshTokenExpiresIn),
        });

        await this.sessionRepository.save(session);

        const accessToken = await this.tokenService.generateAccessToken(
            user.id,
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}
