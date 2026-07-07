"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = require("@sendgrid/mail");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        sgMail.setApiKey(config.get('SENDGRID_API_KEY', ''));
        this.fromEmail = config.get('MAIL_FROM', 'noreply@tidehome.co.uk');
        this.frontendUrl = config.get('FRONTEND_URL', 'http://localhost:5173');
    }
    async sendWelcomeEmail(email, firstName, tempPassword, role) {
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
    async sendAdminWelcomeEmail(email, firstName, username) {
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
    async sendPasswordReset(email, firstName, token) {
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
    async send(to, subject, html) {
        try {
            await sgMail.send({
                to,
                from: this.fromEmail,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}: ${subject}`);
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}: ${err?.response?.body?.errors?.[0]?.message || err.message}`);
        }
    }
    async sendContactFormEmail(data) {
        const adminEmail = this.config.get('ADMIN_EMAIL', 'admin@tidehome.co.uk');
        const subject = `New contact form submission — ${data.subject || 'General enquiry'}`;
        const html = `
    <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
      <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin:6px 0 0">New contact form submission</p>
      </div>
      <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
        <h2 style="color:#0B3D52;margin-top:0">New enquiry received</h2>
        <div style="background:white;border:1px solid rgba(11,61,82,0.12);border-radius:8px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Name:</strong> ${data.firstName} ${data.lastName || ''}</p>
          <p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#1A6B8A">${data.email}</a></p>
          ${data.phone ? `<p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.subject ? `<p style="margin:0 0 8px;font-size:0.85rem;color:#5A7A8A"><strong>Subject:</strong> ${data.subject}</p>` : ''}
          <p style="margin:0;font-size:0.85rem;color:#5A7A8A"><strong>Message:</strong></p>
          <p style="margin:8px 0 0;font-size:0.875rem;color:#0B3D52;line-height:1.7;background:#f7f3ee;padding:0.75rem;border-radius:6px">${data.message}</p>
        </div>
        <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Your Tide Home enquiry'}" 
           style="display:inline-block;background:#0B3D52;color:white;padding:0.75rem 1.75rem;border-radius:8px;text-decoration:none;font-weight:600">
          Reply to ${data.firstName} →
        </a>
        <p style="font-size:0.75rem;color:#5A7A8A;margin-top:1.5rem">Submitted at ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
      </div>
    </div>`;
        await this.send(adminEmail, subject, html);
        const confirmHtml = `
    <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
      <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
      </div>
      <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
        <h2 style="color:#0B3D52;margin-top:0">Thanks for getting in touch, ${data.firstName}!</h2>
        <p style="color:#5A7A8A;line-height:1.7">We've received your message and will get back to you within 24 hours during office hours.</p>
        <div style="background:white;border:1px solid rgba(11,61,82,0.12);border-radius:8px;padding:1.25rem;margin:1.5rem 0">
          <p style="margin:0 0 4px;font-size:0.8rem;color:#5A7A8A">Your message:</p>
          <p style="margin:0;font-size:0.875rem;color:#0B3D52;line-height:1.7">${data.message}</p>
        </div>
        <p style="color:#5A7A8A;font-size:0.875rem">For urgent matters please call our 24/7 support line: <strong>+44 800 123 4567</strong></p>
      </div>
    </div>`;
        await this.send(data.email, 'We received your message — Tide Home', confirmHtml);
    }
    async sendPaymentReceipt(to, payment) {
        const subject = `Tide Home — Payment Receipt ${payment.receiptNumber}`;
        const html = `
    <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:2rem">
      <div style="background:#0B3D52;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;font-size:1.5rem;margin:0">TideHome</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin:6px 0 0">Payment Receipt</p>
      </div>
      <div style="background:#f7f3ee;padding:2rem;border-radius:0 0 12px 12px">
        <h2 style="color:#0B3D52;margin-top:0">Payment Receipt</h2>
        <p style="color:#5A7A8A;font-size:0.875rem">Thank you for your payment. Please find your receipt details below.</p>
        <div style="background:white;border:1px solid rgba(11,61,82,0.12);border-radius:8px;padding:1.25rem;margin:1.5rem 0">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Receipt number</td>
              <td style="padding:8px 0;text-align:right;font-weight:600;color:#0B3D52">${payment.receiptNumber}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Resident</td>
              <td style="padding:8px 0;text-align:right;color:#0B3D52">${payment.residentName}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Care package</td>
              <td style="padding:8px 0;text-align:right;color:#0B3D52">${payment.carePackage}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Payment method</td>
              <td style="padding:8px 0;text-align:right;color:#0B3D52">${payment.method}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Date</td>
              <td style="padding:8px 0;text-align:right;color:#0B3D52">${new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="padding:8px 0;color:#5A7A8A">Status</td>
              <td style="padding:8px 0;text-align:right;color:#0B3D52;text-transform:capitalize">${payment.status}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0;color:#0B3D52;font-weight:600;font-size:1rem">Total amount</td>
              <td style="padding:12px 0 0;text-align:right;color:#0B3D52;font-weight:700;font-size:1.25rem">£${Number(payment.amount).toLocaleString()}</td>
            </tr>
          </table>
        </div>
        <p style="font-size:0.75rem;color:#5A7A8A;margin-top:1.5rem">
          Tide Home Care Services Ltd · 12 Riverside Close, London SE1 7PB<br/>
          Tel: +44 20 7946 0823 · hello@tidehome.co.uk
        </p>
        <p style="font-size:0.75rem;color:#5A7A8A;margin-top:0.5rem">If you have any questions about this receipt, please contact us.</p>
      </div>
    </div>`;
        await this.send(to, subject, html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map