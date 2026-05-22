export type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
};

export abstract class EmailService {
    abstract sendEmail(options: SendEmailOptions): Promise<void>;
}
