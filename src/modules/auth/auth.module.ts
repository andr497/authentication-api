import { Module } from '@nestjs/common';

import { HashService } from './infrastructure/services/hash.service';
import { UserRepository } from './domain/repositories/user.repository';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { SessionRepository } from './domain/repositories/session.repository';
import { PrismaSessionRepository } from './infrastructure/persistence/prisma-session.repository';
import { TokenService } from './application/contracts/token-service.contract';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        RegisterUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        HashService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: SessionRepository,
            useClass: PrismaSessionRepository,
        },
        {
            provide: TokenService,
            useClass: JwtTokenService,
        },
    ],
})
export class AuthModule {}
