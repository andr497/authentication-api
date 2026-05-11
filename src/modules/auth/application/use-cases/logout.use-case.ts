import { Injectable } from '@nestjs/common';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';

import { LogoutDto } from '../dto/logout.dto';
import { RefreshTokenService } from '../contracts/refresh-token-service.contract';

@Injectable()
export class LogoutUseCase {
    constructor(
        private sessionRepository: SessionRepository,
        private hashService: HashService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async execute(dto: LogoutDto) {
        const payload = await this.refreshTokenService.verify(dto.refreshToken);

        const session = await this.sessionRepository.findById(
            payload.sessionId,
        );

        if (!session) return;

        if (session.revokedAt) return;

        const isValid = await this.hashService.compare(
            dto.refreshToken,
            session.getRefreshTokenHash(),
        );

        if (!isValid) return;

        await this.sessionRepository.revoke(session.id);
    }
}
