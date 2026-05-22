import { EnvService } from './env.service';

export type LoggingConfig = {
    driver: 'single' | 'daily';
    level: string;
    directory: string;
    maxDays: number;
};

export const createLoggingConfig = (env: EnvService): LoggingConfig => ({
    driver: env.getEnv<'single' | 'daily'>('LOG_DRIVER'),
    level: env.getEnv('LOG_LEVEL'),
    directory: env.getEnv('LOG_DIRECTORY'),
    maxDays: env.getEnv<number>('LOG_MAX_DAYS', (value) => Number(value)),
});
