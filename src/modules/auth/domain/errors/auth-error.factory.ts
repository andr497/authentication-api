import { AuthErrorCode } from './auth-error.code';
import { AuthError } from './auth-error';

export class AuthErrors {
    static invalidEmail(message: string = 'Invalid email') {
        return new AuthError(AuthErrorCode.INVALID_EMAIL, 422, message);
    }

    static weakPassword(
        message: string = 'Password must be at least 8 characters',
    ) {
        return new AuthError(AuthErrorCode.WEAK_PASSWORD, 422, message);
    }

    static userAlreadyExists(message: string = 'User already exists') {
        return new AuthError(AuthErrorCode.USER_ALREADY_EXISTS, 409, message);
    }

    static invalidCredentials(message: string = 'Invalid credentials') {
        return new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 401, message);
    }
}
