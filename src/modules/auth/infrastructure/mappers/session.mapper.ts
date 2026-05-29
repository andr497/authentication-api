import { Session as PrismaSession } from '@prisma-client/client';
import { Session } from '@modules/auth/domain/entities/session.entity';

export class SessionMapper {
    static toDomain(session: PrismaSession): Session {
        return Session.restore({
            id: session.id,
            userId: session.userId,
            refreshTokenHash: session.refreshTokenHash,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,

            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        });
    }

    static toPersistence(session: Session) {
        return {
            id: session.id,
            userId: session.userId,
            refreshTokenHash: session.getRefreshTokenHash(),
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
        };
    }
}
