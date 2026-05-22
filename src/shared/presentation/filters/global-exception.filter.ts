import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionReporter } from '@src/shared/infrastructure/exceptions/contracts/exception-reporter.contract';
import { ExceptionHandlerResolver } from '@src/shared/infrastructure/exceptions/exception-handler.resolver';
import { LogService } from '@src/shared/infrastructure/logging/contracts/log-service.contract';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly resolver: ExceptionHandlerResolver,
        private readonly logger: LogService,
        private readonly reporter: ExceptionReporter,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const handler = this.resolver.resolve(exception);

        return handler.handle(exception, host, this.logger, this.reporter);
    }
}
