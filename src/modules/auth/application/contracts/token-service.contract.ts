import { AccessTokenPayload } from '../types/access-token-payload.type';
import { RefreshTokenPayload } from '../types/refresh-token-payload.type';

export abstract class TokenService {
    abstract generateAccessToken(payload: AccessTokenPayload): Promise<string>;

    abstract generateRefreshToken(
        payload: RefreshTokenPayload,
    ): Promise<string>;

    abstract verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
}
