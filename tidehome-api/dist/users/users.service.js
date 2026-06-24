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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const user_entity_1 = require("./user.entity");
const mail_service_1 = require("../common/mail.service");
let UsersService = class UsersService {
    constructor(usersRepo, mailService) {
        this.usersRepo = usersRepo;
        this.mailService = mailService;
    }
    async findAll() {
        return this.usersRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findById(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByEmail(email) {
        return this.usersRepo.findOne({ where: { email } });
    }
    async findByUsername(username) {
        return this.usersRepo.findOne({ where: { username } });
    }
    async create(dto, creatorRole) {
        const existing = await this.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        if (dto.role === user_entity_1.UserRole.SUPER_ADMIN && creatorRole !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can create another Super Admin account');
        }
        const tempPassword = (0, uuid_1.v4)().substring(0, 10);
        const hashed = await bcrypt.hash(tempPassword, 12);
        const user = this.usersRepo.create({
            ...dto,
            password: hashed,
            isActive: true,
        });
        const saved = await this.usersRepo.save(user);
        await this.mailService.sendWelcomeEmail(saved.email, saved.firstName, tempPassword, saved.role);
        return saved;
    }
    async updateProfile(id, dto) {
        const user = await this.findById(id);
        Object.assign(user, dto);
        return this.usersRepo.save(user);
    }
    async adminUpdate(id, dto) {
        const user = await this.findById(id);
        Object.assign(user, dto);
        return this.usersRepo.save(user);
    }
    async changePassword(id, dto) {
        const user = await this.usersRepo.findOne({ where: { id } });
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid)
            throw new common_1.ForbiddenException('Current password is incorrect');
        user.password = await bcrypt.hash(dto.newPassword, 12);
        await this.usersRepo.save(user);
        return { message: 'Password changed successfully' };
    }
    async resendCredentials(id) {
        const user = await this.findById(id);
        const tempPassword = (0, uuid_1.v4)().substring(0, 10);
        user.password = await bcrypt.hash(tempPassword, 12);
        await this.usersRepo.save(user);
        await this.mailService.sendWelcomeEmail(user.email, user.firstName, tempPassword, user.role);
        return { message: 'Login credentials resent to ' + user.email };
    }
    async deactivate(id) {
        const user = await this.findById(id);
        user.isActive = false;
        await this.usersRepo.save(user);
        return { message: 'Account deactivated' };
    }
    async updateLastLogin(id) {
        await this.usersRepo.update(id, { lastLogin: new Date() });
    }
    async createDirect(data) {
        const existingUsername = await this.findByUsername(data.username);
        if (existingUsername) {
            throw new common_1.ConflictException(`Username "${data.username}" is already taken. Please choose another.`);
        }
        const username = data.username.toLowerCase().replace(/\s+/g, '');
        const user = this.usersRepo.create({ ...data, username, isActive: true });
        return this.usersRepo.save(user);
    }
    async updatePassword(id, hashedPassword) {
        await this.usersRepo.update(id, { password: hashedPassword });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map