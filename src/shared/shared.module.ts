import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { TransactionManager } from './application/contracts/transaction-manager.contract';
import { ExceptionHandlerResolver } from './infrastructure/exceptions/exception-handler.resolver';
import { ExceptionReporter } from './infrastructure/exceptions/contracts/exception-reporter.contract';
import { PrismaTransactionManager } from './infrastructure/database/prisma/prisma-transaction-manager';
import { FileExceptionReporter } from './infrastructure/exceptions/service/file-exception-reporter.service';
import { EventBus } from './application/contracts/event-bus.contract';
import { NestEventBus } from './infrastructure/events/nest-event-bus';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
    imports: [EventEmitterModule.forRoot()],
    providers: [
        ExceptionHandlerResolver,
        {
            provide: TransactionManager,
            useClass: PrismaTransactionManager,
        },
        {
            provide: ExceptionReporter,
            useClass: FileExceptionReporter,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        {
            provide: EventBus,
            useClass: NestEventBus,
        },
    ],
    exports: [TransactionManager, ExceptionReporter, EventBus],
})
export class SharedModule {}
