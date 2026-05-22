import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { sanitizeStack } from '@src/shared/utils/exceptions/sanitize-stack';

import { LogService } from '../../logging/contracts/log-service.contract';
import { ExceptionReporter } from '../contracts/exception-reporter.contract';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';

export class UnknownExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(): boolean {
        return true;
    }

    handle(
        exception: Error,
        host: ArgumentsHost,
        logger: LogService,
        reporter: ExceptionReporter,
    ) {
        const response = host.switchToHttp().getResponse();

        logger.error(
            exception.message,
            sanitizeStack(exception.stack).join('\n'),
            UnknownExceptionHandler.name,
        );

        reporter.report(exception);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
        });
    }
}
