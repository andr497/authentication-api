import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        PrismaModule,
        SharedModule,
        AuthModule,
    ],
})
export class AppModule {}
