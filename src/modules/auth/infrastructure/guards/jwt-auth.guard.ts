import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthErrors } from '@modules/auth/domain/errors/auth-error.factory';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any,
    ): TUser {
        if (err) {
            throw err;
        }

        if (!user) {
            if (info instanceof Error) {
                switch (info.name) {
                    case 'TokenExpiredError':
                        throw AuthErrors.invalidCredentials('Token expired');

                    case 'JsonWebTokenError':
                        throw AuthErrors.invalidCredentials('Invalid token');

                    case 'NotBeforeError':
                        throw AuthErrors.invalidCredentials(
                            'Token not active yet',
                        );
                }

                throw AuthErrors.invalidCredentials(info.message);
            }
        }

        return user;
    }
}
