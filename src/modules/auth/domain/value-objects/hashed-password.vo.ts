export class HashedPassword {
    private constructor(private readonly value: string) {}

    static create(value: string): HashedPassword {
        return new HashedPassword(value);
    }

    getValue(): string {
        return this.value;
    }
}
