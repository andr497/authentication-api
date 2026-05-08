export abstract class TokenService {
    abstract generateAccessToken(userId: string): Promise<string>;

    abstract generateRefreshToken(
        userId: string,
        sessionId: string,
    ): Promise<string>;

    abstract verifyRefreshToken(token: string): Promise<{
        sub: string;
        sessionId: string;
    }>;
}
