import { ArgumentsHost } from '@nestjs/common';
import { DomainError } from '@shared/domain/errors/domain-error';

import { LogService } from '../../logging/contracts/log-service.contract';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';

export class DomainExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean {
        return exception instanceof DomainError;
    }

    handle(
        exception: DomainError,
        host: ArgumentsHost,
        logger: LogService,
    ): void {
        const response = host.switchToHttp().getResponse();

        logger.warn(exception.message, DomainExceptionHandler.name, {
            code: exception.code,
        });
        return response.status(exception.statusCode).json({
            code: exception.code,
            message: exception.message,
        });
    }
}
