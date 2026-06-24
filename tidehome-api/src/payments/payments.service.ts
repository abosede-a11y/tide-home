import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';

export class CreatePaymentDto {
  @ApiProperty() @IsString() residentId: string;
  @ApiProperty() @IsString() residentName: string;
  @ApiProperty() @IsString() carePackage: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) method: PaymentMethod;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional() @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Payment) private repo: Repository<Payment>) {}

  findAll(): Promise<Payment[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByResident(residentId: string): Promise<Payment[]> {
    return this.repo.find({ where: { residentId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Payment> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Payment not found');
    return p;
  }

  async create(dto: CreatePaymentDto, recordedById: string): Promise<Payment> {
    const receiptNumber = 'RCP-' + Date.now().toString().slice(-6);
    const p = this.repo.create({ ...dto, receiptNumber, recordedById });
    return this.repo.save(p);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const p = await this.findById(id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async getSummary() {
    const payments = await this.repo.find();
    const totalPaid = payments.filter(p => p.status === PaymentStatus.PAID).reduce((s, p) => s + Number(p.amount), 0);
    const totalOverdue = payments.filter(p => p.status === PaymentStatus.OVERDUE).reduce((s, p) => s + Number(p.amount), 0);
    const totalProcessing = payments.filter(p => p.status === PaymentStatus.PROCESSING).reduce((s, p) => s + Number(p.amount), 0);
    return { totalPaid, totalOverdue, totalProcessing, count: payments.length };
  }
}
