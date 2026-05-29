export class PasswordReset {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly tokenHash: string,
        public readonly expiresAt: Date,
        public usedAt: Date | null,

        public readonly createdAt: Date,
    ) {}

    static create(params: {
        id: string;
        userId: string;
        tokenHash: string;
        expiresAt: Date;
    }): PasswordReset {
        return new PasswordReset(
            params.id,
            params.userId,
            params.tokenHash,
            params.expiresAt,
            null,
            new Date(),
        );
    }

    static restore(params: {
        id: string;
        userId: string;
        tokenHash: string;
        expiresAt: Date;
        usedAt?: Date | null;
        createdAt: Date;
    }): PasswordReset {
        return new PasswordReset(
            params.id,
            params.userId,
            params.tokenHash,
            params.expiresAt,
            params.usedAt ?? null,
            params.createdAt,
        );
    }

    isExpired(): boolean {
        return this.expiresAt < new Date();
    }

    isUsed(): boolean {
        return this.usedAt !== null;
    }

    markAsUsed(): void {
        this.usedAt = new Date();
    }
}
