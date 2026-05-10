import { Injectable } from '@nestjs/common';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';

@Injectable()
export class PrismaSessionRepository extends SessionRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(session: Session): Promise<Session> {
        const created = await this.prisma.session.create({
            data: {
                id: session.id,
                userId: session.userId,
                refreshTokenHash: session.getRefreshTokenHash(),

                userAgent: session.userAgent,
                ipAddress: session.ipAddress,

                expiresAt: session.expiresAt,
                revokedAt: session.revokedAt,
            },
        });

        return Session.create({
            id: created.id,
            userId: created.userId,
            refreshTokenHash: created.refreshTokenHash,
            userAgent: created.userAgent,
            ipAddress: created.ipAddress,
            expiresAt: created.expiresAt,
            revokedAt: created.revokedAt,
        });
    }

    async findById(id: string): Promise<Session | null> {
        const session = await this.prisma.session.findUnique({
            where: { id },
        });

        if (!session) return null;

        return Session.create({
            id: session.id,
            userId: session.userId,
            refreshTokenHash: session.refreshTokenHash,

            userAgent: session.userAgent,
            ipAddress: session.ipAddress,

            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
        });
    }

    async revoke(id: string): Promise<void> {
        await this.prisma.session.update({
            where: { id },

            data: {
                revokedAt: new Date(),
            },
        });
    }

    async revokeAllByUserId(userId: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}
