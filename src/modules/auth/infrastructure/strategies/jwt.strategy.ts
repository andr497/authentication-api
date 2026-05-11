import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@modules/auth/presentation/http/types/auth-user.type';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { AccessTokenPayload } from '@modules/auth/application/types/access-token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(
                'JWT_ACCESS_SECRET',
            ) as string,
        });
    }

    async validate(payload: AccessTokenPayload): Promise<AuthUser> {
        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('UNAUTHORIZED_USER_NOT_FOUND');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('UNAUTHORIZED_USER_INACTIVE');
        }
        const session = await this.sessionRepository.findById(
            payload.sessionId,
        );

        if (!session) {
            throw new UnauthorizedException('UNAUTHORIZED_SESSION_NOT_FOUND');
        }

        if (session.revokedAt) {
            throw new UnauthorizedException('UNAUTHORIZED_SESSION_REVOKED');
        }

        if (session.expiresAt.getTime() < Date.now()) {
            throw new UnauthorizedException('UNAUTHORIZED_SESSION_EXPIRED');
        }

        return payload;
    }
}
