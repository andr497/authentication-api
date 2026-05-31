import { Provider } from '@nestjs/common';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { VerifyEmailUseCase } from '@modules/auth/application/use-cases/verify-email.use-case';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.use-case';
import { ForgotPasswordUseCase } from '@modules/auth/application/use-cases/forgot-password.use-case';

export const useCasesProviders: Provider[] = [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    VerifyEmailUseCase,
    ForgotPasswordUseCase,
];
