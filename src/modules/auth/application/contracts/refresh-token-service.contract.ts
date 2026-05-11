import { RefreshTokenPayload } from '../types/refresh-token-payload.type';

export abstract class RefreshTokenService {
    abstract generate(payload: RefreshTokenPayload): Promise<string>;
    abstract verify(token: string): Promise<RefreshTokenPayload>;
}
