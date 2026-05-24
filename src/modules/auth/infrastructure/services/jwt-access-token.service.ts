import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { createAuthConfig } from '@config/auth.config';
import { AccessTokenPayload } from '@modules/auth/application/types/access-token-payload.type';
import { AccessTokenService } from '@modules/auth/application/contracts/access-token-service.contract';

@Injectable()
export class JwtAccessTokenService extends AccessTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly env: EnvService,
    ) {
        super();
    }

    private get authConfig() {
        return createAuthConfig(this.env);
    }

    async generate(payload: AccessTokenPayload): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: payload.sub,
                sessionId: payload.sessionId,
            },
            {
                expiresIn: this.authConfig.accessTokenExpiresIn,
                secret: this.authConfig.accessTokenSecret,
                issuer: this.authConfig.issuer,
            },
        );
    }

    async verify(token: string): Promise<AccessTokenPayload> {
        return this.jwtService.verifyAsync(token, {
            secret: this.authConfig.accessTokenSecret,
            issuer: this.authConfig.issuer,
        });
    }
}
