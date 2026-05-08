import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { LoggerService } from './shared/infrastructure/logging/logger.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        PrismaModule,
        AuthModule,
    ],

    providers: [LoggerService],

    exports: [LoggerService],
})
export class AppModule {}
