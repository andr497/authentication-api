import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LogService } from '@shared/infrastructure/logging/contracts/log-service.contract';
import { ExceptionHandlerResolver } from '@shared/infrastructure/exceptions/exception-handler.resolver';
import { ExceptionReporter } from '@shared/infrastructure/exceptions/contracts/exception-reporter.contract';

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
