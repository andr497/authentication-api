import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/client';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { TransactionManager } from '@src/shared/application/contracts/transaction-manager.contract';

@Injectable()
export class PrismaTransactionManager extends TransactionManager {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async run<T>(
        callback: (tx: Prisma.TransactionClient) => Promise<T>,
    ): Promise<T> {
        return this.prisma.client.$transaction((tx) => callback(tx));
    }
}
