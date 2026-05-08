export class Session {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        private refreshTokenHash: string,
        public readonly userAgent: string | null,
        public readonly ipAddress: string | null,
        public readonly expiresAt: Date,
        public revokedAt: Date | null = null,
    ) {}

    static create(params: {
        id: string;
        userId: string;
        refreshTokenHash: string;
        userAgent?: string | null;
        ipAddress?: string | null;
        expiresAt: Date;
        revokedAt?: Date | null;
    }): Session {
        return new Session(
            params.id,
            params.userId,
            params.refreshTokenHash,
            params.userAgent ?? null,
            params.ipAddress ?? null,
            params.expiresAt,
            params.revokedAt ?? null,
        );
    }

    revoke(): void {
        this.revokedAt = new Date();
    }

    getRefreshTokenHash(): string {
        return this.refreshTokenHash;
    }
}
