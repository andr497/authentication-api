import { Prisma } from '@prisma-client/client';

export abstract class TransactionManager {
    abstract run<T>(
        callback: (tx: Prisma.TransactionClient) => Promise<T>,
    ): Promise<T>;
}
