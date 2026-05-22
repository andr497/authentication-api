import { Injectable } from '@nestjs/common';

import { LogService } from '../contracts/log-service.contract';
import { LogEntry } from '../dto/log-entry.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService extends LogService {
    constructor(private readonly logger: PinoLogger) {
        super();
    }

    log(entry: LogEntry): void {
        const payload = {
            context: entry.context,
            metadata: entry.metadata,
            trace: entry.trace,
        };

        this.logger[entry.level](payload, entry.message);
    }

    info(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void {
        this.log({
            level: 'info',
            message,
            context,
            metadata,
        });
    }

    warn(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void {
        this.log({
            level: 'warn',
            message,
            context,
            metadata,
        });
    }

    error(
        message: string,
        trace?: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void {
        this.log({
            level: 'error',
            message,
            trace,
            context,
            metadata,
        });
    }

    debug(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void {
        this.log({
            level: 'debug',
            message,
            context,
            metadata,
        });
    }
}
