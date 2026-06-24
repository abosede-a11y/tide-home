import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail: string;
  private readonly frontendUrl: string;

  constructor(private config: ConfigService) {
    sgMail.setApiKey(config.get('SENDGRID_API_KEY', ''));
    this.fromEmail = config.get('MAIL_FROM', 'noreply@tidehome.co.uk');
    this.frontendUrl = config.get('FRONTEND_URL', 'http://localhost:5173');
  }

  async sendWelcomeEmail(email: string, firstName: string, tempPassword: string, role: string) {
    const subject = 'Welcome to Tide Home — Your Login Credentials';
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
        <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin:6px 0 0">Care Management Platform</p>
        </div>
        <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
          <h2 style="color:#0B3D52;margin-top:0">Welcome, ${firstName}!</h2>
          <p style="color:#5A7A8A;line-height:1.7">Your Tide Home portal account has been created. Use the credentials below to sign in:</p>
          <div style="background:white;border:1px solid rgba(11,61,82,0.12);border-radius:8px;padding:1.25rem;margin:1.5rem 0">
            <p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Email:</strong> ${email}</p>
            <p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Temporary password:</strong> <code style="background:#f0f0f0;padding:2px 8px;border-radius:4px;font-size:1rem">${tempPassword}</code></p>
            <p style="margin:0;font-size:0.85rem;color:#5A7A8A"><strong>Role:</strong> ${role}</p>
          </div>
          <p style="color:#8A6010;font-size:0.8rem;background:#faeeda;border-radius:6px;padding:0.75rem">⚠️ Please change your password after your first login for security.</p>
          <a href="${this.frontendUrl}/login"
             style="display:inline-block;background:#0B3D52;color:white;padding:0.75rem 1.75rem;border-radius:8px;text-decoration:none;font-weight:600;margin-top:1rem">
            Login to Tide Home →
          </a>
          <p style="font-size:0.75rem;color:#5A7A8A;margin-top:2rem">If you did not expect this email, please contact support@tidehome.co.uk</p>
        </div>
      </div>`;
    await this.send(email, subject, html);
  }

  async sendAdminWelcomeEmail(email: string, firstName: string, username: string) {
    const subject = 'Welcome to Tide Home — Admin Account Created';
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
        <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin:6px 0 0">Care Management Platform</p>
        </div>
        <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
          <h2 style="color:#0B3D52;margin-top:0">Your admin account is ready, ${firstName}!</h2>
          <p style="color:#5A7A8A;line-height:1.7">You have successfully registered as an Administrator on Tide Home.</p>
          <div style="background:white;border:1px solid rgba(11,61,82,0.12);border-radius:8px;padding:1.25rem;margin:1.5rem 0">
            <p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Email:</strong> ${email}</p>
            <p style="margin:0;font-size:0.85rem;color:#5A7A8A"><strong>Username:</strong> @${username}</p>
          </div>
          <a href="${this.frontendUrl}/login"
             style="display:inline-block;background:#0B3D52;color:white;padding:0.75rem 1.75rem;border-radius:8px;text-decoration:none;font-weight:600;margin-top:1rem">
            Go to portal →
          </a>
          <p style="font-size:0.75rem;color:#5A7A8A;margin-top:2rem">If you did not expect this email, please contact support@tidehome.co.uk</p>
        </div>
      </div>`;
    await this.send(email, subject, html);
  }

  async sendPasswordReset(email: string, firstName: string, token: string) {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const subject = 'Tide Home — Password Reset Request';
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
        <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
        </div>
        <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
          <h2 style="color:#0B3D52;margin-top:0">Password Reset Request</h2>
          <p style="color:#5A7A8A;line-height:1.7">Hi ${firstName}, we received a request to reset your Tide Home password. Click the button below — this link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#0B3D52;color:white;padding:0.75rem 1.75rem;border-radius:8px;text-decoration:none;font-weight:600;margin-top:0.5rem">
            Reset my password →
          </a>
          <p style="font-size:0.8rem;color:#5A7A8A;margin-top:1.5rem;background:#f0f0f0;padding:0.75rem;border-radius:6px;word-break:break-all">
            Or copy this link: ${resetUrl}
          </p>
          <p style="font-size:0.75rem;color:#5A7A8A;margin-top:1.5rem">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>`;
    await this.send(email, subject, html);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await sgMail.send({
        to,
        from: this.fromEmail,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err?.response?.body?.errors?.[0]?.message || err.message}`);
    }
  }
}