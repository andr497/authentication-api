import { AggregateRoot } from '@shared/domain/entities/aggregate-root';

import { Session } from './session.entity';
import { Email } from '../value-objects/email.vo';
import { EmailVerification } from './email-verification.entity';
import { PasswordReset } from './password-reset.entity';

export class User extends AggregateRoot {
    constructor(
        public readonly id: string,
        public readonly email: Email,
        private password: string,
        public isVerified: boolean,
        public isActive: boolean,

        public readonly createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
    ) {
        super();
    }

    static create(params: {
        id: string;
        email: Email;
        password: string;
    }): User {
        const now = new Date();
        return new User(
            params.id,
            params.email,
            params.password,
            false,
            true,

            now,
            now,
            null,
        );
    }

    static restore(params: {
        id: string;
        email: Email;
        password: string;
        isVerified: boolean;
        isActive: boolean;

        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
    }): User {
        return new User(
            params.id,
            params.email,
            params.password,
            params.isVerified,
            params.isActive,

            params.createdAt,
            params.updatedAt,

            params.deletedAt ?? null,
        );
    }

    createSession(params: {
        sessionId: string;
        refreshTokenHash: string;
        userAgent?: string | null;
        ipAddress?: string | null;
        expiresAt: Date;
    }): Session {
        return Session.create({
            id: params.sessionId,
            userId: this.id,
            refreshTokenHash: params.refreshTokenHash,
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            expiresAt: params.expiresAt,
        });
    }

    rotateSession(params: {
        currentSession: Session;
        newSessionId: string;
        refreshTokenHash: string;

        userAgent?: string | null;
        ipAddress?: string | null;

        expiresAt: Date;
    }): Session {
        params.currentSession.revoke();

        return this.createSession({
            sessionId: params.newSessionId,
            refreshTokenHash: params.refreshTokenHash,
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            expiresAt: params.expiresAt,
        });
    }

    createEmailVerification(params: {
        verificationId: string;
        tokenHash: string;
        expiresAt: Date;
    }): EmailVerification {
        return EmailVerification.create({
            id: params.verificationId,
            userId: this.id,
            tokenHash: params.tokenHash,
            expiresAt: params.expiresAt,
        });
    }

    createPasswordReset(params: {
        resetId: string;
        tokenHash: string;
        expiresAt: Date;
    }): PasswordReset {
        return PasswordReset.create({
            id: params.resetId,
            userId: this.id,
            tokenHash: params.tokenHash,
            expiresAt: params.expiresAt,
        });
    }

    verifyEmail() {
        if (this.isVerified) {
            return;
        }
        this.isVerified = true;
        this.touch();
    }

    changePassword(newPassword: string) {
        this.password = newPassword;
        this.touch();
    }

    delete(): void {
        this.deletedAt = new Date();
        this.touch();
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }

    touch(): void {
        this.updatedAt = new Date();
    }

    isEmailVerified(): boolean {
        return this.isVerified;
    }

    getPassword(): string {
        return this.password;
    }
}
