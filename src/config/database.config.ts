import { EnvService } from './env.service';

export type DatabaseConfig = {
    url: string;
};

export const createDatabaseConfig = (env: EnvService): DatabaseConfig => ({
    url: env.getEnv('DATABASE_URL'),
});
