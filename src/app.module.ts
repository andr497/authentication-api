import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

import { SharedModule } from './shared/shared.module';
import { AppConfigModule } from './config/config.module';
import { LoggingModule } from './shared/infrastructure/logging/logging.module';

@Module({
    imports: [
        AppConfigModule,
        PrismaModule,
        LoggingModule,
        SharedModule,
        AuthModule,
    ],
})
export class AppModule {}
