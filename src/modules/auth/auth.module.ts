import { Module } from '@nestjs/common';

import { HashService } from './infrastructure/services/hash.service';
import { UserRepository } from './domain/repositories/user.repository';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';

@Module({
    controllers: [AuthController],
    providers: [
        RegisterUseCase,
        HashService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
})
export class AuthModule {}
