import { DomainError } from '@src/shared/domain/errors/domain-error';
import { AuthErrorCode } from './auth-error-code.enum';

export class InvalidEmailError extends DomainError {
    constructor(message: string = 'Invalid email') {
        super(AuthErrorCode.INVALID_EMAIL, 422, message);
    }
}

export class WeakPasswordError extends DomainError {
    constructor(message: string = 'Password must be at least 8 characters') {
        super(AuthErrorCode.WEAK_PASSWORD, 422, message);
    }
}

export class UserAlreadyExistsError extends DomainError {
    constructor(message: string = 'User already exists') {
        super(AuthErrorCode.USER_ALREADY_EXISTS, 409, message);
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor(message: string = 'Invalid credentials') {
        super(AuthErrorCode.INVALID_CREDENTIALS, 401, message);
    }
}
