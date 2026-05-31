import { Injectable } from '@nestjs/common';
import { TransactionManager } from '@shared/application/contracts/transaction-manager.contract';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaTransactionManager extends TransactionManager {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async run<T>(callback: () => Promise<T>): Promise<T> {
        return this.prisma.runInTransaction(callback);
    }
}
