import { EnvService } from './env.service';

export type SMTPConfig = {
    host: string;
    port: number;

    secure: boolean;
    user: string;
    pass: string;

    from: string;
};

export const createSMTPConfig = (env: EnvService): SMTPConfig => ({
    host: env.getEnv('SMTP_HOST'),
    port: env.getEnv<number>('SMTP_PORT'),
    secure: env.getEnv<boolean>('SMTP_SECURE', (value) => value === 'true'),

    user: env.getEnv('SMTP_USER'),
    pass: env.getEnv('SMTP_PASS'),
    from: env.getEnv('SMTP_FROM'),
});
