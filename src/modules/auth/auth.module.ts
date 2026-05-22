import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { HashService } from './infrastructure/services/hash.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { servicesProviders } from './infrastructure/providers/services.providers';
import { useCasesProviders } from './infrastructure/providers/use-cases.providers';
import { repositoriesProviders } from './infrastructure/providers/repositories.providers';
import { VerificationEmailService } from './application/services/verification-email.service';
import { LoggerService } from '@src/shared/infrastructure/logging/services/logger.service';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        ...useCasesProviders,
        ...repositoriesProviders,
        ...servicesProviders,

        HashService,
        JwtStrategy,
        VerificationEmailService,
        LoggerService,
    ],
})
export class AuthModule {}
