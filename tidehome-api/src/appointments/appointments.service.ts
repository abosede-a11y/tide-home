import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Appointment, AppointmentStatus } from './appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty() @IsString() residentId: string;
  @ApiProperty() @IsString() residentName: string;
  @ApiProperty() @IsString() appointmentType: string;
  @ApiProperty() @IsString() hospital: string;
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() appointmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hospital?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(AppointmentStatus) status?: AppointmentStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() outcome?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(@InjectRepository(Appointment) private repo: Repository<Appointment>) {}

  findAll(): Promise<Appointment[]> {
    return this.repo.find({ order: { scheduledAt: 'DESC' } });
  }

  findByResident(residentId: string): Promise<Appointment[]> {
    return this.repo.find({ where: { residentId }, order: { scheduledAt: 'DESC' } });
  }

  async findById(id: string): Promise<Appointment> {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Appointment not found');
    return a;
  }

  async create(dto: CreateAppointmentDto, createdById: string): Promise<Appointment> {
    const a = this.repo.create({ ...dto, createdById });
    return this.repo.save(a);
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const a = await this.findById(id);
    Object.assign(a, dto);
    return this.repo.save(a);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.repo.delete(id);
    return { message: 'Appointment removed' };
  }
}
