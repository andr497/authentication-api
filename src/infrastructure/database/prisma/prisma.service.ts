import { PrismaPg } from '@prisma/adapter-pg';
import { EnvService } from '@config/env.service';
import { Prisma, PrismaClient } from '@prisma-client/client';
import { createAppConfig } from '@config/app.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createDatabaseConfig } from '@config/database.config';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class PrismaService implements OnModuleInit {
    private readonly storage =
        new AsyncLocalStorage<Prisma.TransactionClient>();
    private readonly prisma: PrismaClient;

    constructor(env: EnvService) {
        const databaseConfig = createDatabaseConfig(env);
        const appConfig = createAppConfig(env);

        this.prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: databaseConfig.url,
            }),
            log: appConfig.isDevelopment ? ['error', 'warn'] : ['error'],
        });
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    get client() {
        return this.storage.getStore() ?? this.prisma;
    }

    async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            return this.storage.run(tx, callback);
        });
    }
}
