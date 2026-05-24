import { ArgumentsHost, HttpException } from '@nestjs/common';
import { sanitizeStack } from '@shared/utils/exceptions/sanitize-stack';

import { LogService } from '../../logging/contracts/log-service.contract';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';

export class HttpExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean {
        return exception instanceof HttpException;
    }

    handle(
        exception: HttpException,
        host: ArgumentsHost,
        logger: LogService,
    ): void {
        const response = host.switchToHttp().getResponse();

        const status = exception.getStatus();
        const error = exception.getResponse();

        logger.error(exception.message, sanitizeStack(exception.stack).join());
        return response.status(status).json(error);
    }
}
