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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../common/mail.service");
const user_entity_1 = require("../users/user.entity");
const contact_service_1 = require("../contact/contact.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, mailService, contactService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.contactService = contactService;
        this.resetTokens = new Map();
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials or account inactive');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.usersService.updateLastLogin(user.id);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                linkedResidentId: user.linkedResidentId,
            },
        };
    }
    async registerAdmin(dto) {
        const validKey = this.configService.get('ADMIN_REGISTRATION_KEY', 'TideHome-Admin-2025');
        if (dto.registrationKey !== validKey) {
            throw new common_1.ForbiddenException('Invalid registration key. Contact your Super Admin for the key.');
        }
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const hashed = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.createDirect({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            username: dto.username,
            password: hashed,
            role: user_entity_1.UserRole.ADMIN,
        });
        await this.mailService.sendAdminWelcomeEmail(user.email, user.firstName, user.username || '');
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        };
    }
    async forgotPassword(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            return { message: 'If that email exists, a reset link has been sent.' };
        }
        const token = (0, uuid_1.v4)();
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        this.resetTokens.set(token, { userId: user.id, expires });
        await this.mailService.sendPasswordReset(user.email, user.firstName, token);
        return { message: 'If that email exists, a reset link has been sent.' };
    }
    async resetPassword(dto) {
        const entry = this.resetTokens.get(dto.token);
        if (!entry || entry.expires < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.usersService.updatePassword(entry.userId, hashed);
        this.resetTokens.delete(dto.token);
        return { message: 'Password reset successfully. You can now log in.' };
    }
    async checkUsername(username) {
        const existing = await this.usersService.findByUsername(username.toLowerCase().replace(/\s+/g, ''));
        return !!existing;
    }
    async getProfile(userId) {
        return this.usersService.findById(userId);
    }
    async sendContactEmail(dto) {
        await this.contactService.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            subject: dto.subject,
            message: dto.message,
        });
        await this.mailService.sendContactFormEmail(dto);
        return { message: 'Your message has been received. We will be in touch within 24 hours.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService,
        contact_service_1.ContactService])
], AuthService);
//# sourceMappingURL=auth.service.js.map