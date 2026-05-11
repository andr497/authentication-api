import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExceptionHandlerStrategy } from '../contracts/exception-handler.contract';
import { LoggerService } from '../../logging/logger.service';

export class UnknownExceptionHandler implements ExceptionHandlerStrategy {
    canHandle(): boolean {
        return true;
    }

    handle(_: unknown, host: ArgumentsHost, logger: LoggerService) {
        const response = host.switchToHttp().getResponse();

        logger.logError('Unknown error', _ as string);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
}
