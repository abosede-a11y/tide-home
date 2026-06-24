import { Repository } from 'typeorm';
import { Resident } from './resident.entity';
export declare class CreateResidentDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roomNumber?: string;
    floor?: number;
    carePackage?: string;
    status?: string;
    medicalHistory?: string;
    allergies?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    gpName?: string;
    gpPhone?: string;
    guardianUserId?: string;
    notes?: string;
    photoUrl?: string;
}
export declare class UpdateResidentDto {
    firstName?: string;
    lastName?: string;
    roomNumber?: string;
    floor?: number;
    carePackage?: string;
    status?: string;
    notes?: string;
    allergies?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    gpName?: string;
    gpPhone?: string;
    medicalHistory?: string;
    photoUrl?: string;
    guardianUserId?: string;
}
export declare class ResidentsService {
    private repo;
    constructor(repo: Repository<Resident>);
    findAll(): Promise<Resident[]>;
    findById(id: string): Promise<Resident>;
    findByGuardian(guardianUserId: string): Promise<Resident[]>;
    create(dto: CreateResidentDto): Promise<Resident>;
    update(id: string, dto: UpdateResidentDto): Promise<Resident>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
