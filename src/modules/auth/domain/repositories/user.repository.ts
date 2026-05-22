import { RepositoryOptions } from '@src/shared/domain/types/repository-options.type';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
    abstract save(user: User): Promise<User>;

    abstract update(user: User): Promise<User>;

    abstract findById(
        id: string,
        options?: RepositoryOptions,
    ): Promise<User | null>;

    abstract findByEmail(
        email: string,
        options?: RepositoryOptions,
    ): Promise<User | null>;
}
