import { Repository } from 'typeorm';
import { Medication } from './medication.entity';
export declare class CreateMedicationDto {
    residentId: string;
    residentName: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    instructions?: string;
    nextDue?: string;
}
export declare class UpdateMedicationDto {
    medicationName?: string;
    dosage?: string;
    frequency?: string;
    instructions?: string;
    status?: string;
}
export declare class LogDoseDto {
    givenByName: string;
}
export declare class MedicationsService {
    private repo;
    constructor(repo: Repository<Medication>);
    findAll(): Promise<Medication[]>;
    findByResident(residentId: string): Promise<Medication[]>;
    create(dto: CreateMedicationDto): Promise<Medication>;
    update(id: string, dto: UpdateMedicationDto): Promise<Medication>;
    logDose(id: string, dto: LogDoseDto, userId: string): Promise<Medication>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
