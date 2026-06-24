export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class RegisterAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    registrationKey: string;
}
