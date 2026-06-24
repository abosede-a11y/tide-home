import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
export declare class CreateAppointmentDto {
    residentId: string;
    residentName: string;
    appointmentType: string;
    hospital: string;
    scheduledAt: string;
    notes?: string;
}
export declare class UpdateAppointmentDto {
    appointmentType?: string;
    hospital?: string;
    scheduledAt?: string;
    status?: AppointmentStatus;
    notes?: string;
    outcome?: string;
}
export declare class AppointmentsService {
    private repo;
    constructor(repo: Repository<Appointment>);
    findAll(): Promise<Appointment[]>;
    findByResident(residentId: string): Promise<Appointment[]>;
    findById(id: string): Promise<Appointment>;
    create(dto: CreateAppointmentDto, createdById: string): Promise<Appointment>;
    update(id: string, dto: UpdateAppointmentDto): Promise<Appointment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
