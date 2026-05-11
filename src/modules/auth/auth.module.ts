import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { HashService } from './infrastructure/services/hash.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { SessionRepository } from './domain/repositories/session.repository';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { AccessTokenService } from './application/contracts/access-token-service.contract';
import { JwtAccessTokenService } from './infrastructure/services/jwt-access-token.service';
import { RefreshTokenService } from './application/contracts/refresh-token-service.contract';
import { JwtRefreshTokenService } from './infrastructure/services/jwt-refresh-token.service';
import { PrismaSessionRepository } from './infrastructure/persistence/prisma-session.repository';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        RegisterUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        HashService,
        JwtStrategy,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: SessionRepository,
            useClass: PrismaSessionRepository,
        },
        {
            provide: AccessTokenService,
            useClass: JwtAccessTokenService,
        },
        {
            provide: RefreshTokenService,
            useClass: JwtRefreshTokenService,
        },
    ],
})
export class AuthModule {}
