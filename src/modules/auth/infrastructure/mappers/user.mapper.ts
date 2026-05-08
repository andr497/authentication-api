import { Prisma, User as PrismaUser } from '@prisma-client/client';
import { User } from '@modules/auth/domain/entities/user.entity';
import { Email } from '@modules/auth/domain/value-objects/email.vo';

export class UserMapper {
    static toDomain(data: PrismaUser): User {
        return new User(
            data.id,
            Email.create(data.email),
            data.password,
            data.isVerified,
            data.isActive,
        );
    }

    static toPersistence(user: User): Prisma.UserCreateInput {
        return {
            id: user.id,
            email: user.email.getValue(),
            password: user.getPassword(),
            isVerified: user.isVerified,
            isActive: user.isActive,
        };
    }
}
