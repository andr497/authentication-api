import { Injectable } from '@nestjs/common';
import { TokenService } from '../../application/contracts/token-service.contract';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '../config/auth.config';
import { AccessTokenPayload } from '../../application/types/access-token-payload.type';
import { RefreshTokenPayload } from '../../application/types/refresh-token-payload.type';

@Injectable()
export class JwtTokenService extends TokenService {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
        return this.jwtService.signAsync(
            { sub: payload.sub, sessionId: payload.sessionId },
            { expiresIn: authConfig.accessTokenExpiresIn },
        );
    }

    async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
        return this.jwtService.signAsync(
            { sub: payload.sub, sessionId: payload.sessionId },
            { expiresIn: authConfig.refreshTokenExpiresIn },
        );
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        return this.jwtService.verifyAsync(token);
    }
}
