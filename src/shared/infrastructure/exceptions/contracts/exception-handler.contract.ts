import { ArgumentsHost } from '@nestjs/common';
import { LogService } from '../../logging/contracts/log-service.contract';
import { ExceptionReporter } from './exception-reporter.contract';

export interface ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean;

    handle(
        exception: unknown,
        host: ArgumentsHost,
        logger: LogService,
        reporter: ExceptionReporter,
    ): void;
}
