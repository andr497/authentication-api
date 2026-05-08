import { Injectable } from '@nestjs/common';
import { TokenService } from '../../application/contracts/token-service.contract';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '../config/auth.config';

@Injectable()
export class JwtTokenService extends TokenService {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    async generateAccessToken(userId: string): Promise<string> {
        return this.jwtService.signAsync(
            { sub: userId },
            { expiresIn: authConfig.accessTokenExpiresIn },
        );
    }

    async generateRefreshToken(
        userId: string,
        sessionId: string,
    ): Promise<string> {
        return this.jwtService.signAsync(
            { sub: userId, sessionId },
            { expiresIn: authConfig.refreshTokenExpiresIn },
        );
    }

    async verifyRefreshToken(
        token: string,
    ): Promise<{ sub: string; sessionId: string }> {
        return this.jwtService.verifyAsync(token);
    }
}
