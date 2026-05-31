import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { servicesProviders } from './infrastructure/providers/services.providers';
import { useCasesProviders } from './infrastructure/providers/use-cases.providers';
import { repositoriesProviders } from './infrastructure/providers/repositories.providers';
import { VerificationEmailService } from './application/services/verification-email.service';
import { eventsProviders } from './infrastructure/providers/events.providers';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        ...useCasesProviders,
        ...repositoriesProviders,
        ...servicesProviders,
        ...eventsProviders,

        JwtStrategy,
        VerificationEmailService,
    ],
})
export class AuthModule {}
