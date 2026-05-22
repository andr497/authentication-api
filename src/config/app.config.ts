import { EnvService } from './env.service';

export enum AppEnvironment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export type AppConfig = {
    url: string;
    port: number;
    environment: AppEnvironment;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
};

export const createAppConfig = (env: EnvService) => {
    const environment = env.getEnv<AppEnvironment>('NODE_ENV');
    const host = env.getEnv('APP_HOST');
    const port = env.getEnv<number>('APP_PORT');

    const url = `${host}:${port}`;

    const validEnvironments = [
        AppEnvironment.DEVELOPMENT,
        AppEnvironment.PRODUCTION,
        AppEnvironment.TEST,
    ];

    if (!validEnvironments.includes(environment)) {
        throw new Error(`Invalid NODE_ENV: ${environment}`);
    }

    return {
        url,
        port,
        environment,

        isDevelopment: environment === AppEnvironment.DEVELOPMENT,
        isProduction: environment === AppEnvironment.PRODUCTION,
        isTest: environment === AppEnvironment.TEST,
    };
};
