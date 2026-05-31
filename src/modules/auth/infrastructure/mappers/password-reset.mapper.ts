import { PasswordReset } from '@modules/auth/domain/entities/password-reset.entity';
import { PasswordReset as PrismaPasswordReset } from '@prisma-client/client';

export class PasswordResetMapper {
    static toDomain(passwordReset: PrismaPasswordReset): PasswordReset {
        return PasswordReset.restore({
            id: passwordReset.id,
            userId: passwordReset.userId,
            tokenHash: passwordReset.tokenHash,
            expiresAt: passwordReset.expiresAt,
            usedAt: passwordReset.usedAt,

            createdAt: passwordReset.createdAt,
        });
    }

    static toPersistence(passwordReset: PasswordReset) {
        return {
            id: passwordReset.id,
            userId: passwordReset.userId,
            tokenHash: passwordReset.tokenHash,
            expiresAt: passwordReset.expiresAt,
            usedAt: passwordReset.usedAt,

            createdAt: passwordReset.createdAt,
        };
    }
}
