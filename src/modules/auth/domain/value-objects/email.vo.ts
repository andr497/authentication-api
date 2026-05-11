import { AuthErrors } from '../errors/auth-error.factory';

export class Email {
    private constructor(private readonly value: string) {}

    static create(value: string): Email {
        const normalizedEmail = value.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            throw AuthErrors.invalidEmail();
        }

        return new Email(normalizedEmail);
    }

    getValue(): string {
        return this.value;
    }
}
