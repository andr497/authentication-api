import { ArgumentsHost } from '@nestjs/common';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';
import { DomainError } from '@src/shared/domain/errors/domain-error';
import { LoggerService } from '../../logging/logger.service';

export class DomainExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean {
        return exception instanceof DomainError;
    }

    handle(
        exception: DomainError,
        host: ArgumentsHost,
        logger: LoggerService,
    ): void {
        const response = host.switchToHttp().getResponse();

        logger.logError(exception.message, exception.stack);
        return response.status(exception.statusCode).json({
            code: exception.code,
            message: exception.message,
        });
    }
}
