import { LogLevel } from '../types/log-level.type';

export interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    trace?: string;
    metadata?: Record<string, unknown>;
}
