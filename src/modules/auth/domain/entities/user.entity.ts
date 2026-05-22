import { Email } from '../value-objects/email.vo';

export class User {
    constructor(
        public readonly id: string,
        public readonly email: Email,
        private password: string,
        public isVerified: boolean,
        public isActive: boolean,
    ) {}

    static create(params: {
        id: string;
        email: Email;
        password: string;
    }): User {
        return new User(params.id, params.email, params.password, false, true);
    }

    static restore(params: {
        id: string;
        email: Email;
        password: string;
        isVerified: boolean;
        isActive: boolean;
    }): User {
        return new User(
            params.id,
            params.email,
            params.password,
            params.isVerified,
            params.isActive,
        );
    }

    verifyEmail() {
        this.isVerified = true;
    }

    changePassword(newPassword: string) {
        this.password = newPassword;
    }

    getPassword(): string {
        return this.password;
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }
}
