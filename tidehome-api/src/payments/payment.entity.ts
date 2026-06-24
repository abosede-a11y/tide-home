import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  PROCESSING = 'processing',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'Bank Transfer',
  DIRECT_DEBIT = 'Direct Debit',
  CARD = 'Card',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() receiptNumber: string;
  @Column() residentId: string;
  @Column() residentName: string;
  @Column() carePackage: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) status: PaymentStatus;
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER }) method: PaymentMethod;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) recordedById: string;
  @CreateDateColumn() createdAt: Date;
}
