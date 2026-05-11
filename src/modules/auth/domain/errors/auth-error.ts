import { DomainError } from '@shared/domain/errors/domain-error';
import { AuthErrorCode } from './auth-error.code';

export class AuthError extends DomainError {
    constructor(
        public readonly code: AuthErrorCode,
        statusCode: number,
        message: string,
    ) {
        super(code, statusCode, message);
    }
}
