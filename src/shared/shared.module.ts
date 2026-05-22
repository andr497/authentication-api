import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { ExceptionHandlerResolver } from './infrastructure/exceptions/exception-handler.resolver';
import { ExceptionReporter } from './infrastructure/exceptions/contracts/exception-reporter.contract';
import { FileExceptionReporter } from './infrastructure/exceptions/service/file-exception-reporter.service';

@Module({
    providers: [
        ExceptionHandlerResolver,
        {
            provide: ExceptionReporter,
            useClass: FileExceptionReporter,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
    ],
})
export class SharedModule {}
