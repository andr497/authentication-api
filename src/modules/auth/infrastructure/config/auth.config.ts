import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

export const createAuthConfig = (config: ConfigService) => ({
    accessTokenExpiresIn: '15m' as StringValue,
    refreshTokenExpiresIn: '7d' as StringValue,

    accessTokenSecret: config.get<string>('JWT_ACCESS_SECRET')!,
    refreshTokenSecret: config.get<string>('JWT_REFRESH_SECRET')!,
});
