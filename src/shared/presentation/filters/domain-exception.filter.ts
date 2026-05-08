import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '@src/shared/domain/errors/domain-error';
import { LoggerService } from '@src/shared/infrastructure/logging/logger.service';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: DomainError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        this.logger.logWarning(
            `[DOMAIN ERROR] ${exception.code} - ${exception.message}`,
        );

        return response.status(exception.statusCode).json({
            message: exception.message,
            code: exception.code,
        });
    }
}
