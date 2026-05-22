import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { EmailVerification } from '@modules/auth/domain/entities/email-verification.entity';
import { EmailVerificationRepository } from '@modules/auth/domain/repositories/email-verification.repository';
import { EmailVerificationMapper } from '../mappers/email-verification.mapper';

@Injectable()
export class PrismaEmailVerificationRepository extends EmailVerificationRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(verification: EmailVerification): Promise<void> {
        await this.prisma.emailVerification.create({
            data: EmailVerificationMapper.toPersistence(verification),
        });
    }

    async update(verification: EmailVerification): Promise<EmailVerification> {
        const updateVerification = await this.prisma.emailVerification.update({
            where: {
                id: verification.id,
            },
            data: {
                usedAt: verification.usedAt,
            },
        });

        return EmailVerificationMapper.toDomain(updateVerification);
    }

    async findLatestByUserId(
        userId: string,
    ): Promise<EmailVerification | null> {
        const verification = await this.prisma.emailVerification.findFirst({
            where: {
                userId,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },

            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!verification) {
            return null;
        }

        return EmailVerificationMapper.toDomain(verification);
    }

    async markAsUsed(id: string): Promise<void> {
        await this.prisma.emailVerification.update({
            where: { id },

            data: {
                usedAt: new Date(),
            },
        });
    }
}
