import { ResidentsService, CreateResidentDto, UpdateResidentDto } from './residents.service';
export declare class ResidentsController {
    private service;
    constructor(service: ResidentsService);
    findAll(): Promise<import("./resident.entity").Resident[]>;
    myResidents(req: any): Promise<import("./resident.entity").Resident[]>;
    findOne(id: string): Promise<import("./resident.entity").Resident>;
    create(dto: CreateResidentDto): Promise<import("./resident.entity").Resident>;
    update(id: string, dto: UpdateResidentDto): Promise<import("./resident.entity").Resident>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
