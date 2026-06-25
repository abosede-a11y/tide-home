import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { MailService } from '../common/mail.service';

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
  @ApiPropertyOptional() @IsOptional() @IsEnum(PaymentMethod) method?: PaymentMethod;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() carePackage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class SendReceiptDto {
  @ApiProperty() @IsEmail({}, { message: 'Please enter a valid email address' }) email: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private repo: Repository<Payment>,
    private mailService: MailService,
  ) {}

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

  async update(id: string, dto: UpdatePaymentDto, updatedById: string): Promise<Payment> {
    const p = await this.findById(id);
    const before = { status: p.status, method: p.method, amount: p.amount, notes: p.notes };
    Object.assign(p, dto);
    // Log the update in notes for audit
    const auditEntry = `\n[Updated ${new Date().toLocaleString('en-GB')} by user ${updatedById}]: ` +
      Object.entries(dto)
        .filter(([k, v]) => v !== undefined && (before as any)[k] !== v)
        .map(([k, v]) => `${k}: ${(before as any)[k]} → ${v}`)
        .join(', ');
    if (auditEntry.trim().length > 20) {
      p.notes = (p.notes || '') + auditEntry;
    }
    return this.repo.save(p);
  }

  async sendReceipt(id: string, dto: SendReceiptDto): Promise<{ message: string }> {
    const p = await this.findById(id);
    await this.mailService.sendPaymentReceipt(dto.email, p);
    return { message: `Receipt sent to ${dto.email}` };
  }

  async getSummary() {
    const payments = await this.repo.find();
    const totalPaid = payments.filter(p => p.status === PaymentStatus.PAID).reduce((s, p) => s + Number(p.amount), 0);
    const totalOverdue = payments.filter(p => p.status === PaymentStatus.OVERDUE).reduce((s, p) => s + Number(p.amount), 0);
    const totalProcessing = payments.filter(p => p.status === PaymentStatus.PROCESSING).reduce((s, p) => s + Number(p.amount), 0);
    return { totalPaid, totalOverdue, totalProcessing, count: payments.length };
  }
}