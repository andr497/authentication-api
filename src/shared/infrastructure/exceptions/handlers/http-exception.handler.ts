import { ArgumentsHost, HttpException } from '@nestjs/common';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';
import { LoggerService } from '../../logging/logger.service';

export class HttpExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean {
        return exception instanceof HttpException;
    }

    handle(
        exception: HttpException,
        host: ArgumentsHost,
        logger: LoggerService,
    ): void {
        const response = host.switchToHttp().getResponse();

        const status = exception.getStatus();
        const error = exception.getResponse();

        logger.logError(exception.message, exception.stack);
        return response.status(status).json(error);
    }
}
