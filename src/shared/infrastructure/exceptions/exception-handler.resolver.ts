import { Injectable } from '@nestjs/common';
import { ExceptionHandlerStrategy } from './contracts/exception-handler.contract';
import { DomainExceptionHandler } from './handlers/domain-exception.handler';
import { HttpExceptionHandler } from './handlers/http-exception.handler';
import { UnknownExceptionHandler } from './handlers/unknown-exception.handler';

@Injectable()
export class ExceptionHandlerResolver {
    private readonly handlers = [
        new DomainExceptionHandler(),
        new HttpExceptionHandler(),
        new UnknownExceptionHandler(),
    ];

    resolve(exception: unknown): ExceptionHandlerStrategy {
        const handler = this.handlers.find((handler) =>
            handler.canHandle(exception),
        );

        if (!handler) {
            throw new Error('No exception handler found.');
        }

        return handler;
    }
}
