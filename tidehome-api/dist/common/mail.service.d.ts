import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private readonly logger;
    private readonly fromEmail;
    private readonly frontendUrl;
    constructor(config: ConfigService);
    sendWelcomeEmail(email: string, firstName: string, tempPassword: string, role: string): Promise<void>;
    sendAdminWelcomeEmail(email: string, firstName: string, username: string): Promise<void>;
    sendPasswordReset(email: string, firstName: string, token: string): Promise<void>;
    private send;
    sendContactFormEmail(data: {
        firstName: string;
        lastName?: string;
        email: string;
        phone?: string;
        subject?: string;
        message: string;
    }): Promise<void>;
}
