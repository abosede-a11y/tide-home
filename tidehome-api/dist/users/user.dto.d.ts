import { UserRole } from './user.entity';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
    linkedResidentId?: string;
}
export declare class UpdateUserDto {
    phone?: string;
    address?: string;
    email?: string;
}
export declare class AdminUpdateUserDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    photoUrl?: string;
    socialSecurityNumber?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
