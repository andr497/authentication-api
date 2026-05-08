import { StringValue } from 'ms';

export const authConfig: {
    accessTokenExpiresIn: StringValue;

    refreshTokenExpiresIn: StringValue;
} = {
    accessTokenExpiresIn: '15m',

    refreshTokenExpiresIn: '7d',
};
