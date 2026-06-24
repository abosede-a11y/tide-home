import { PaymentsService, CreatePaymentDto, UpdatePaymentDto } from './payments.service';
export declare class PaymentsController {
    private service;
    constructor(service: PaymentsService);
    findAll(): Promise<import("./payment.entity").Payment[]>;
    getSummary(): Promise<{
        totalPaid: number;
        totalOverdue: number;
        totalProcessing: number;
        count: number;
    }>;
    findByResident(id: string): Promise<import("./payment.entity").Payment[]>;
    getReceipt(id: string): Promise<import("./payment.entity").Payment>;
    create(dto: CreatePaymentDto, req: any): Promise<import("./payment.entity").Payment>;
    update(id: string, dto: UpdatePaymentDto): Promise<import("./payment.entity").Payment>;
}
