export class Session {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        private refreshTokenHash: string,
        public readonly userAgent: string | null,
        public readonly ipAddress: string | null,
        public readonly expiresAt: Date,
        public revokedAt: Date | null = null,

        public readonly createdAt: Date,
        public updatedAt: Date,
    ) {}

    static create(params: {
        id: string;
        userId: string;
        refreshTokenHash: string;
        userAgent?: string | null;
        ipAddress?: string | null;
        expiresAt: Date;
    }): Session {
        const now = new Date();
        return new Session(
            params.id,
            params.userId,
            params.refreshTokenHash,
            params.userAgent ?? null,
            params.ipAddress ?? null,
            params.expiresAt,
            null,

            now,
            now,
        );
    }

    static restore(params: {
        id: string;
        userId: string;
        refreshTokenHash: string;

        userAgent?: string | null;
        ipAddress?: string | null;

        expiresAt: Date;
        revokedAt?: Date | null;

        createdAt: Date;
        updatedAt: Date;
    }): Session {
        return new Session(
            params.id,
            params.userId,
            params.refreshTokenHash,
            params.userAgent ?? null,
            params.ipAddress ?? null,
            params.expiresAt,
            params.revokedAt ?? null,

            params.createdAt,
            params.updatedAt,
        );
    }

    revoke(): void {
        this.revokedAt = new Date();
    }

    touch(): void {
        this.updatedAt = new Date();
    }

    getRefreshTokenHash(): string {
        return this.refreshTokenHash;
    }
}
