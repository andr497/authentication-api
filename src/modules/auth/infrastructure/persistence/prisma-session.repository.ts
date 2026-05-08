import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { Session } from '../../domain/entities/session.entity';

@Injectable()
export class PrismaSessionRepository extends SessionRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(session: Session): Promise<Session> {
        await this.prisma.session.create({
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

        return session;
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
