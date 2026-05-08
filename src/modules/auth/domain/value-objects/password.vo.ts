import { WeakPasswordError } from '../errors/auth-exceptions.error';

export class Password {
    private constructor(private readonly value: string) {}

    static create(value: string): Password {
        if (!value || value.length < 8) {
            throw new WeakPasswordError();
        }

        return new Password(value);
    }

    getValue(): string {
        return this.value;
    }
}
