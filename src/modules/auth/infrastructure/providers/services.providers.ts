import { Provider } from '@nestjs/common';
import { HashService } from '@modules/auth/application/contracts/hash-service.contract';
import { EmailService } from '@modules/auth/application/contracts/email-service.contract';
import { AccessTokenService } from '@modules/auth/application/contracts/access-token-service.contract';
import { RefreshTokenService } from '@modules/auth/application/contracts/refresh-token-service.contract';

import { BcryptHashService } from '../services/bcrypt-hash.service';
import { JwtAccessTokenService } from '../services/jwt-access-token.service';
import { NodemailerEmailService } from '../services/nodemailer-email.service';
import { JwtRefreshTokenService } from '../services/jwt-refresh-token.service';

export const servicesProviders: Provider[] = [
    {
        provide: HashService,
        useClass: BcryptHashService,
    },
    {
        provide: AccessTokenService,
        useClass: JwtAccessTokenService,
    },
    {
        provide: RefreshTokenService,
        useClass: JwtRefreshTokenService,
    },
    {
        provide: EmailService,
        useClass: NodemailerEmailService,
    },
];
