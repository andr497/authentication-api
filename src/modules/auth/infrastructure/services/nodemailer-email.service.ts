import * as nodemailer from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { EnvService } from '@src/config/env.service';
import { createSMTPConfig, SMTPConfig } from '@src/config/smtp.config';
import {
    EmailService,
    SendEmailOptions,
} from '@modules/auth/application/contracts/email-service.contract';

@Injectable()
export class NodemailerEmailService extends EmailService {
    private readonly smtpConfig: SMTPConfig;
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly env: EnvService) {
        super();

        this.smtpConfig = createSMTPConfig(this.env);
        this.transporter = nodemailer.createTransport({
            host: this.smtpConfig.host,
            port: this.smtpConfig.port,

            secure: this.smtpConfig.secure,

            auth: {
                user: this.smtpConfig.user,
                pass: this.smtpConfig.pass,
            },
        });
    }

    async sendEmail(options: SendEmailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: this.smtpConfig.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
}
