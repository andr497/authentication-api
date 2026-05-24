import { PrismaPg } from '@prisma/adapter-pg';
import { EnvService } from '@config/env.service';
import { PrismaClient } from '@prisma-client/client';
import { createAppConfig } from '@config/app.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createDatabaseConfig } from '@config/database.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(env: EnvService) {
        const databaseConfig = createDatabaseConfig(env);
        const appConfig = createAppConfig(env);
        super({
            adapter: new PrismaPg({
                connectionString: databaseConfig.url,
            }),
            log: appConfig.isDevelopment
                ? ['query', 'error', 'warn']
                : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
