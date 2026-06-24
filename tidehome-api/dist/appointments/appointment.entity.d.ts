export declare enum AppointmentStatus {
    UPCOMING = "upcoming",
    COMPLETED = "completed",
    MISSED = "missed",
    CANCELLED = "cancelled"
}
export declare class Appointment {
    id: string;
    residentId: string;
    residentName: string;
    appointmentType: string;
    hospital: string;
    scheduledAt: Date;
    status: AppointmentStatus;
    notes: string;
    outcome: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}
