import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/mail.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, RegisterAdminDto } from './auth.dto';
import { UserRole } from '../users/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private mailService;
    private resetTokens;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, mailService: MailService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            photoUrl: string;
            linkedResidentId: string;
        };
    }>;
    registerAdmin(dto: RegisterAdminDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    checkUsername(username: string): Promise<boolean>;
    getProfile(userId: string): Promise<import("../users/user.entity").User>;
}
