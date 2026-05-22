import { Provider } from '@nestjs/common';
import { UserRepository } from '@modules/auth/domain/repositories/user.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { EmailVerificationRepository } from '@modules/auth/domain/repositories/email-verification.repository';

import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaSessionRepository } from '../persistence/prisma-session.repository';
import { PrismaEmailVerificationRepository } from '../persistence/prisma-email-verification.repository';

export const repositoriesProviders: Provider[] = [
    {
        provide: UserRepository,
        useClass: PrismaUserRepository,
    },
    {
        provide: SessionRepository,
        useClass: PrismaSessionRepository,
    },
    {
        provide: EmailVerificationRepository,
        useClass: PrismaEmailVerificationRepository,
    },
];
