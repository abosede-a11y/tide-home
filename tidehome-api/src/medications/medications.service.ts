import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Medication, MedStatus } from './medication.entity';

export class CreateMedicationDto {
  @ApiProperty() @IsString() residentId: string;
  @ApiProperty() @IsString() residentName: string;
  @ApiProperty() @IsString() medicationName: string;
  @ApiProperty() @IsString() dosage: string;
  @ApiProperty() @IsString() frequency: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instructions?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextDue?: string;
}

export class UpdateMedicationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() medicationName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dosage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instructions?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class LogDoseDto {
  @ApiProperty() @IsString() givenByName: string;
}

@Injectable()
export class MedicationsService {
  constructor(@InjectRepository(Medication) private repo: Repository<Medication>) {}

  findAll(): Promise<Medication[]> {
    return this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  findByResident(residentId: string): Promise<Medication[]> {
    return this.repo.find({ where: { residentId, isActive: true } });
  }

  async create(dto: CreateMedicationDto): Promise<Medication> {
  const m = this.repo.create(dto as any) as unknown as Medication;
  return this.repo.save(m);
}

  async update(id: string, dto: UpdateMedicationDto): Promise<Medication> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Medication record not found');
    Object.assign(m, dto);
    return this.repo.save(m);
  }

  async logDose(id: string, dto: LogDoseDto, userId: string): Promise<Medication> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Medication record not found');
    m.lastGiven = new Date();
    m.givenById = userId;
    m.givenByName = dto.givenByName;
    m.status = MedStatus.ON_TRACK;
    return this.repo.save(m);
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException();
    m.isActive = false;
    await this.repo.save(m);
    return { message: 'Medication record removed' };
  }
}
