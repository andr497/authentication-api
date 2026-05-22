import { LogEntry } from '../dto/log-entry.dto';

export abstract class LogService {
    abstract log(entry: LogEntry): void;

    abstract info(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void;

    abstract warn(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void;

    abstract error(
        message: string,
        trace?: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void;

    abstract debug(
        message: string,
        context?: string,
        metadata?: Record<string, unknown>,
    ): void;
}
