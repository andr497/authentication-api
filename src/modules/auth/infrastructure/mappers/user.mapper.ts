import { User as PrismaUser } from '@prisma-client/client';
import { User } from '@modules/auth/domain/entities/user.entity';
import { Email } from '@modules/auth/domain/value-objects/email.vo';
import { HashedPassword } from '@modules/auth/domain/value-objects/hashed-password.vo';

export class UserMapper {
    static toDomain(user: PrismaUser): User {
        return User.restore({
            id: user.id,
            email: Email.create(user.email),
            password: HashedPassword.create(user.password),
            isVerified: user.isVerified,
            isActive: user.isActive,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });
    }

    static toPersistence(user: User) {
        return {
            id: user.id,
            email: user.email.getValue(),
            password: user.getPassword().getValue(),
            isVerified: user.isEmailVerified(),
            isActive: user.isActiveUser(),

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };
    }
}
