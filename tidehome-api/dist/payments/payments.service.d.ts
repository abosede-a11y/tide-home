import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { MailService } from '../common/mail.service';
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
    method?: PaymentMethod;
    amount?: number;
    carePackage?: string;
    notes?: string;
}
export declare class SendReceiptDto {
    email: string;
}
export declare class PaymentsService {
    private repo;
    private mailService;
    constructor(repo: Repository<Payment>, mailService: MailService);
    findAll(): Promise<Payment[]>;
    findByResident(residentId: string): Promise<Payment[]>;
    findById(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto, recordedById: string): Promise<Payment>;
    update(id: string, dto: UpdatePaymentDto, updatedById: string): Promise<Payment>;
    sendReceipt(id: string, dto: SendReceiptDto): Promise<{
        message: string;
    }>;
    getSummary(): Promise<{
        totalPaid: number;
        totalOverdue: number;
        totalProcessing: number;
        count: number;
    }>;
}
