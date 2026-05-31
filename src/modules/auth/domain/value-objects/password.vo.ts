import { AuthErrors } from '../errors/auth-error.factory';

export class Password {
    private constructor(private readonly value: string) {}

    static create(value: string): Password {
        if (!value || value.length < 8) {
            throw AuthErrors.weakPassword();
        }

        return new Password(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Password): boolean {
        if (other === null || other === undefined) {
            return false;
        }

        if (!(other instanceof Password)) {
            return false;
        }

        return this.value === other.getValue();
    }
}
