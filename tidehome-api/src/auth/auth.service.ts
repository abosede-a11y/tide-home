import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/mail.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, RegisterAdminDto } from './auth.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  // In production use Redis for reset tokens
  private resetTokens = new Map<string, { userId: string; expires: Date }>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or account inactive');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
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

  async registerAdmin(dto: RegisterAdminDto) {
    // Validate registration key against env variable
    const validKey = this.configService.get<string>('ADMIN_REGISTRATION_KEY', 'TideHome-Admin-2025');
    if (dto.registrationKey !== validKey) {
      throw new ForbiddenException('Invalid registration key. Contact your Super Admin for the key.');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 12);

    // Use the repository directly via usersService to create without sending email
    const user = await this.usersService.createDirect({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      username: dto.username,
      password: hashed,
      role: UserRole.ADMIN,
    });
    // Send welcome email to newly registered admin
    await this.mailService.sendAdminWelcomeEmail(user.email, user.firstName, user.username || '')
    
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    this.resetTokens.set(token, { userId: user.id, expires });

    await this.mailService.sendPasswordReset(user.email, user.firstName, token);
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const entry = this.resetTokens.get(dto.token);
    if (!entry || entry.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.updatePassword(entry.userId, hashed);
    this.resetTokens.delete(dto.token);
    return { message: 'Password reset successfully. You can now log in.' };
  }

  async checkUsername(username: string): Promise<boolean> {
    const existing = await this.usersService.findByUsername(username.toLowerCase().replace(/\s+/g, ''));
    return !!existing;
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}
