import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma-client/client';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { User } from '@modules/auth/domain/entities/user.entity';
import { UserMapper } from '@modules/auth/infrastructure/mappers/user.mapper';

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(user: User): Promise<User> {
        const savedUser: PrismaUser = await this.prisma.user.create({
            data: UserMapper.toPersistence(user),
        });

        return UserMapper.toDomain(savedUser);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }
}
