import { ArgumentsHost } from '@nestjs/common';
import { LoggerService } from '../../logging/logger.service';

export interface ExceptionHandlerStrategy {
    canHandle(exception: unknown): boolean;

    handle(
        exception: unknown,
        host: ArgumentsHost,
        logger: LoggerService,
    ): void;
}
