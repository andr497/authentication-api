import { EmailVerification } from '@modules/auth/domain/entities/email-verification.entity';
import { EmailVerification as PrismaEmailVerification } from '@prisma-client/client';

export class EmailVerificationMapper {
    static toDomain(verification: PrismaEmailVerification): EmailVerification {
        return EmailVerification.restore({
            id: verification.id,
            userId: verification.userId,
            tokenHash: verification.tokenHash,
            expiresAt: verification.expiresAt,
            usedAt: verification.usedAt,

            createdAt: verification.createdAt,
        });
    }

    static toPersistence(verification: EmailVerification) {
        return {
            id: verification.id,
            userId: verification.userId,
            tokenHash: verification.tokenHash,
            expiresAt: verification.expiresAt,
            usedAt: verification.usedAt,
        };
    }
}
