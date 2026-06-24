import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
export declare class CreatePaymentDto {
    residentId: string;
    residentName: string;
    carePackage: string;
    amount: number;
    method: PaymentMethod;
    notes?: string;
}
export declare class UpdatePaymentDto {
    status?: PaymentStatus;
    notes?: string;
}
export declare class PaymentsService {
    private repo;
    constructor(repo: Repository<Payment>);
    findAll(): Promise<Payment[]>;
    findByResident(residentId: string): Promise<Payment[]>;
    findById(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto, recordedById: string): Promise<Payment>;
    update(id: string, dto: UpdatePaymentDto): Promise<Payment>;
    getSummary(): Promise<{
        totalPaid: number;
        totalOverdue: number;
        totalProcessing: number;
        count: number;
    }>;
}
