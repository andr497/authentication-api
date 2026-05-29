import { PasswordReset } from '../entities/password-reset.entity';

export abstract class PasswordResetRepository {
    abstract save(passwordReset: PasswordReset): Promise<PasswordReset>;
    abstract update(passwordReset: PasswordReset): Promise<PasswordReset>;

    abstract findLatestByUserId(userId: string): Promise<PasswordReset | null>;
}
