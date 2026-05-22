import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { RefreshTokenPayload } from '@modules/auth/application/types/refresh-token-payload.type';
import { RefreshTokenService } from '@modules/auth/application/contracts/refresh-token-service.contract';
import { EnvService } from '@src/config/env.service';
import { createAuthConfig } from '@src/config/auth.config';

@Injectable()
export class JwtRefreshTokenService extends RefreshTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly env: EnvService,
    ) {
        super();
    }

    private get authConfig() {
        return createAuthConfig(this.env);
    }

    async generate(payload: RefreshTokenPayload): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: payload.sub,
                sessionId: payload.sessionId,
            },
            {
                expiresIn: this.authConfig.refreshTokenExpiresIn,
                secret: this.authConfig.refreshTokenSecret,
                issuer: this.authConfig.issuer,
            },
        );
    }

    async verify(token: string): Promise<RefreshTokenPayload> {
        return this.jwtService.verifyAsync(token, {
            secret: this.authConfig.refreshTokenSecret,
            issuer: this.authConfig.issuer,
        });
    }
}
