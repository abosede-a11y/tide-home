export declare enum PaymentStatus {
    PAID = "paid",
    PENDING = "pending",
    OVERDUE = "overdue",
    PROCESSING = "processing"
}
export declare enum PaymentMethod {
    BANK_TRANSFER = "Bank Transfer",
    DIRECT_DEBIT = "Direct Debit",
    CARD = "Card"
}
export declare class Payment {
    id: string;
    receiptNumber: string;
    residentId: string;
    residentName: string;
    carePackage: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    notes: string;
    recordedById: string;
    createdAt: Date;
}
