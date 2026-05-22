import { User as PrismaUser } from '@prisma-client/client';
import { User } from '@modules/auth/domain/entities/user.entity';
import { Email } from '@modules/auth/domain/value-objects/email.vo';

export class UserMapper {
    static toDomain(data: PrismaUser): User {
        return User.restore({
            id: data.id,
            email: Email.create(data.email),
            password: data.password,
            isVerified: data.isVerified,
            isActive: data.isActive,
        });
    }

    static toPersistence(user: User) {
        return {
            id: user.id,
            email: user.email.getValue(),
            password: user.getPassword(),
            isVerified: user.isVerified,
            isActive: user.isActive,
        };
    }
}
