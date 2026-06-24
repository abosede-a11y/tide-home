import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto, AdminUpdateUserDto, ChangePasswordDto } from './user.dto';
import { MailService } from '../common/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepo.findOne({ where: { username } });
  }

  async create(dto: CreateUserDto, creatorRole: UserRole): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    // Only super admin can create other super admin accounts
    if (dto.role === UserRole.SUPER_ADMIN && creatorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can create another Super Admin account');
    }

    const tempPassword = uuidv4().substring(0, 10);
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

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({ where: { id } });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new ForbiddenException('Current password is incorrect');
    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.usersRepo.save(user);
    return { message: 'Password changed successfully' };
  }

  async resendCredentials(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    const tempPassword = uuidv4().substring(0, 10);
    user.password = await bcrypt.hash(tempPassword, 12);
    await this.usersRepo.save(user);
    await this.mailService.sendWelcomeEmail(user.email, user.firstName, tempPassword, user.role);
    return { message: 'Login credentials resent to ' + user.email };
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    user.isActive = false;
    await this.usersRepo.save(user);
    return { message: 'Account deactivated' };
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepo.update(id, { lastLogin: new Date() });
  }

  // Direct create for self-registration (no email sent)
  async createDirect(data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: UserRole;
  }): Promise<User> {
    // Check username uniqueness
    const existingUsername = await this.findByUsername(data.username);
    if (existingUsername) {
      throw new ConflictException(`Username "${data.username}" is already taken. Please choose another.`);
    }
    // Normalise username to lowercase, no spaces
    const username = data.username.toLowerCase().replace(/\s+/g, '');
    const user = this.usersRepo.create({ ...data, username, isActive: true });
    return this.usersRepo.save(user);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.usersRepo.update(id, { password: hashedPassword });
  }
}
