import { Injectable } from '@nestjs/common';
import { UserWhereInput } from '@prisma-client/models';
import { User as PrismaUser } from '@prisma-client/client';
import { User } from '@modules/auth/domain/entities/user.entity';
import { UserMapper } from '@modules/auth/infrastructure/mappers/user.mapper';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { RepositoryOptions } from '@shared/domain/types/repository-options.type';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { PrismaQueryHelper } from '@src/infrastructure/database/prisma/helpers/prisma-query.helper';

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async save(user: User): Promise<User> {
        const savedUser: PrismaUser = await this.prisma.client.user.create({
            data: UserMapper.toPersistence(user),
        });

        return UserMapper.toDomain(savedUser);
    }

    async update(user: User): Promise<User> {
        const updatedUser: PrismaUser = await this.prisma.client.user.update({
            where: {
                id: user.id,
            },
            data: UserMapper.toPersistence(user),
        });
        return UserMapper.toDomain(updatedUser);
    }

    async findById(
        id: string,
        options?: RepositoryOptions,
    ): Promise<User | null> {
        const user = await this.prisma.client.user.findFirst({
            where: PrismaQueryHelper.applyScope<UserWhereInput>(
                {
                    id,
                },
                options,
            ),
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }

    async findByEmail(
        email: string,
        options?: RepositoryOptions,
    ): Promise<User | null> {
        const user = await this.prisma.client.user.findFirst({
            where: PrismaQueryHelper.applyScope<UserWhereInput>(
                {
                    email,
                },
                options,
            ),
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }
}
