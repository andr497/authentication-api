import { Injectable } from '@nestjs/common';
import { EnvService } from '@config/env.service';
import { createAppConfig } from '@config/app.config';
import { LogService } from '@shared/infrastructure/logging/contracts/log-service.contract';
import { ExceptionReporter } from '@shared/infrastructure/exceptions/contracts/exception-reporter.contract';

import { EmailService } from '../contracts/email-service.contract';

@Injectable()
export class VerificationEmailService {
    constructor(
        private readonly emailService: EmailService,
        private readonly reporter: ExceptionReporter,
        private readonly logger: LogService,
        private readonly env: EnvService,
    ) {}

    private get appConfig() {
        return createAppConfig(this.env);
    }

    async send(email: string, token: string, userId: string): Promise<void> {
        try {
            const verificationUrl = `${this.appConfig.url}/auth/verify-email?token=${token}&userId=${userId}`;

            await this.emailService.sendEmail({
                to: email,
                subject: 'Verify your email',
                html: `
                <h1>Email verification</h1>
                <p>
                    Click the button below to verify your account.
                </p>
                <a href="${verificationUrl}">
                    Verify Email
                </a>
            `,
            });
        } catch (error) {
            let message = 'Failed to send verification email';
            let trace = undefined;
            if (error instanceof Error) {
                message = error.message;
                trace = error.stack;
                this.reporter.report(error);
            }
            this.logger.error(message, trace, undefined, {
                email,
                token,
                userId,
            });
        }
    }
}
