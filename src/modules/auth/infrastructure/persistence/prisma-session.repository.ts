import { Injectable } from '@nestjs/common';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class PrismaSessionRepository extends SessionRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(session: Session): Promise<Session> {
        const created = await this.prisma.client.session.create({
            data: SessionMapper.toPersistence(session),
        });

        return SessionMapper.toDomain(created);
    }

    async findById(id: string): Promise<Session | null> {
        const session = await this.prisma.client.session.findFirst({
            where: { id, revokedAt: null, expiresAt: { gt: new Date() } },
        });

        if (!session) return null;

        return SessionMapper.toDomain(session);
    }

    async revoke(id: string): Promise<void> {
        await this.prisma.client.session.update({
            where: { id },

            data: {
                revokedAt: new Date(),
            },
        });
    }

    async revokeAllByUserId(userId: string): Promise<void> {
        await this.prisma.client.session.updateMany({
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
