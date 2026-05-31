import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '@modules/auth/presentation/http/types/auth-user.type';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { AccessTokenPayload } from '@modules/auth/application/types/access-token-payload.type';
import { EnvService } from '@config/env.service';
import { createAuthConfig } from '@config/auth.config';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        env: EnvService,
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: createAuthConfig(env).accessTokenSecret,
        });
    }

    async validate(payload: AccessTokenPayload): Promise<AuthUser> {
        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            throw AuthErrors.invalidCredentials('User not found');
        }

        if (!user.isActiveUser()) {
            throw AuthErrors.accountDisabled();
        }
        const session = await this.sessionRepository.findById(
            payload.sessionId,
        );

        if (!session) {
            throw AuthErrors.invalidCredentials('Session not found');
        }

        if (session.isRevoked()) {
            throw AuthErrors.invalidCredentials('Session revoked');
        }

        if (session.isExpired()) {
            throw AuthErrors.invalidCredentials('Session expired');
        }

        return payload;
    }
}
