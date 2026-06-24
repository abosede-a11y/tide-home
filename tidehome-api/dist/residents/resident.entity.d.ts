export declare enum ResidentStatus {
    STABLE = "stable",
    MONITORING = "monitoring",
    ATTENTION = "attention",
    CRITICAL = "critical"
}
export declare enum CarePackage {
    STANDARD = "Standard Care",
    ENHANCED = "Enhanced Care",
    PREMIUM = "Premium Care"
}
export declare class Resident {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roomNumber: string;
    floor: number;
    carePackage: CarePackage;
    status: ResidentStatus;
    photoUrl: string;
    medicalHistory: string;
    allergies: string;
    emergencyContact: string;
    emergencyPhone: string;
    gpName: string;
    gpPhone: string;
    notes: string;
    guardianUserId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
