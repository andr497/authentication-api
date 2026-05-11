import { Injectable } from '@nestjs/common';
import { AccessTokenService } from '../../application/contracts/access-token-service.contract';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from '../../application/types/access-token-payload.type';
import { createAuthConfig } from '../config/auth.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessTokenService extends AccessTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {
        super();
    }

    private get authConfig() {
        return createAuthConfig(this.config);
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
            },
        );
    }

    async verify(token: string): Promise<AccessTokenPayload> {
        return this.jwtService.verifyAsync(token, {
            secret: this.authConfig.accessTokenSecret,
        });
    }
}
