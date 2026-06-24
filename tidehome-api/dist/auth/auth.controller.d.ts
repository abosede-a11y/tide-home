import { AuthService } from './auth.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, RegisterAdminDto, ContactDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../users/user.entity").UserRole;
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
            role: import("../users/user.entity").UserRole;
        };
    }>;
    checkUsername(username: string): Promise<{
        available: boolean;
        username: string;
    }>;
    getMe(req: any): Promise<import("../users/user.entity").User>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    contact(dto: ContactDto): Promise<{
        message: string;
    }>;
}
