export declare enum UserRole {
    SUPER_ADMIN = "superadmin",
    ADMIN = "admin",
    STAFF = "staff",
    GUARDIAN = "guardian"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: UserRole;
    phone: string;
    address: string;
    photoUrl: string;
    socialSecurityNumber: string;
    isActive: boolean;
    lastLogin: Date;
    linkedResidentId: string;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
