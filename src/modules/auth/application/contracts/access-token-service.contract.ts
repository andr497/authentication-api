import { AccessTokenPayload } from '../types/access-token-payload.type';

export abstract class AccessTokenService {
    abstract generate(payload: AccessTokenPayload): Promise<string>;
    abstract verify(token: string): Promise<AccessTokenPayload>;
}
