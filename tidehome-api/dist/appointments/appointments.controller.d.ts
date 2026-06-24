import { AppointmentsService, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.service';
export declare class AppointmentsController {
    private service;
    constructor(service: AppointmentsService);
    findAll(): Promise<import("./appointment.entity").Appointment[]>;
    findByResident(id: string): Promise<import("./appointment.entity").Appointment[]>;
    create(dto: CreateAppointmentDto, req: any): Promise<import("./appointment.entity").Appointment>;
    update(id: string, dto: UpdateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
