import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/infrastructure/database/prisma/prisma.service';
import { PasswordReset } from '@modules/auth/domain/entities/password-reset.entity';

import { PasswordResetRepository } from '../../domain/repositories/password-reset.repository';
import { PasswordResetMapper } from '../mappers/password-reset.mapper';

@Injectable()
export class PrismaPasswordResetRepository extends PasswordResetRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(passwordReset: PasswordReset): Promise<PasswordReset> {
        const newPasswordReset = await this.prisma.client.passwordReset.create({
            data: PasswordResetMapper.toPersistence(passwordReset),
        });

        return PasswordResetMapper.toDomain(newPasswordReset);
    }

    async update(passwordReset: PasswordReset): Promise<PasswordReset> {
        const updatedPasswordReset =
            await this.prisma.client.passwordReset.update({
                where: {
                    id: passwordReset.id,
                },
                data: {
                    usedAt: passwordReset.usedAt,
                },
            });

        return PasswordResetMapper.toDomain(updatedPasswordReset);
    }

    async findLatestByUserId(userId: string): Promise<PasswordReset | null> {
        const passwordReset = await this.prisma.client.passwordReset.findFirst({
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

        if (!passwordReset) {
            return null;
        }
        return PasswordResetMapper.toDomain(passwordReset);
    }
}
