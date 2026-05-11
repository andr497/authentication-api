import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { LoggerService } from './infrastructure/logging/logger.service';
import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { ExceptionHandlerResolver } from './infrastructure/exceptions/exception-handler.resolver';

@Module({
    providers: [
        LoggerService,

        ExceptionHandlerResolver,

        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
    ],

    exports: [LoggerService],
})
export class SharedModule {}
