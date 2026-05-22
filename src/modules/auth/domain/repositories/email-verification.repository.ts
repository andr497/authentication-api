import { EmailVerification } from '../entities/email-verification.entity';

export abstract class EmailVerificationRepository {
    abstract save(verification: EmailVerification): Promise<void>;
    abstract update(
        verification: EmailVerification,
    ): Promise<EmailVerification>;

    abstract findLatestByUserId(
        userId: string,
    ): Promise<EmailVerification | null>;

    abstract markAsUsed(id: string): Promise<void>;
}
