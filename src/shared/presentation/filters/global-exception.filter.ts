import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionHandlerResolver } from '@src/shared/infrastructure/exceptions/exception-handler.resolver';
import { LoggerService } from '@src/shared/infrastructure/logging/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly resolver: ExceptionHandlerResolver,
        private readonly logger: LoggerService,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const handler = this.resolver.resolve(exception);

        return handler.handle(exception, host, this.logger);
    }
}
