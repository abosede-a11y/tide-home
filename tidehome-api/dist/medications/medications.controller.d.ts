import { MedicationsService, CreateMedicationDto, UpdateMedicationDto, LogDoseDto } from './medications.service';
export declare class MedicationsController {
    private service;
    constructor(service: MedicationsService);
    findAll(): Promise<import("./medication.entity").Medication[]>;
    findByResident(id: string): Promise<import("./medication.entity").Medication[]>;
    create(dto: CreateMedicationDto): Promise<import("./medication.entity").Medication>;
    update(id: string, dto: UpdateMedicationDto): Promise<import("./medication.entity").Medication>;
    logDose(id: string, dto: LogDoseDto, req: any): Promise<import("./medication.entity").Medication>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
