import { StringValue } from 'ms';

import { EnvService } from './env.service';

export type AuthConfig = {
    accessTokenExpiresIn: StringValue;
    refreshTokenExpiresIn: StringValue;
    accessTokenSecret: string;
    refreshTokenSecret: string;
    issuer: string;

    emailVerificationEnabled: boolean;
};

export const createAuthConfig = (env: EnvService): AuthConfig => ({
    accessTokenExpiresIn: env.getEnv<StringValue>('JWT_ACCESS_EXPIRES'),
    refreshTokenExpiresIn: env.getEnv<StringValue>('JWT_REFRESH_EXPIRES'),
    accessTokenSecret: env.getEnv('JWT_ACCESS_SECRET'),
    refreshTokenSecret: env.getEnv('JWT_REFRESH_SECRET'),
    issuer: env.getEnv('JWT_ISSUER'),

    emailVerificationEnabled: env.getEnv<boolean>(
        'EMAIL_VERIFICATION_ENABLED',
        (value) => value === 'true',
    ),
});
