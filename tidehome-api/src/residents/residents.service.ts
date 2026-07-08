import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './resident.entity';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiProperty() @IsDateString() dateOfBirth: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roomNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() floor?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() carePackage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() medicalHistory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allergies?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gpName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gpPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guardianUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
}

export class UpdateResidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dateOfBirth?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roomNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() floor?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() carePackage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allergies?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gpName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gpPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() medicalHistory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guardianUserId?: string;
}

@Injectable()
export class ResidentsService {
  constructor(@InjectRepository(Resident) private repo: Repository<Resident>) {}

  findAll(): Promise<Resident[]> {
    return this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  // No isActive filter here so both active and archived can be fetched by ID
  async findById(id: string): Promise<Resident> {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Resident not found');
    return r;
  }

  async findByGuardian(guardianUserId: string): Promise<Resident[]> {
    return this.repo.find({ where: { guardianUserId, isActive: true } });
  }

  async findArchived(): Promise<Resident[]> {
    return this.repo.find({ where: { isActive: false }, order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateResidentDto): Promise<Resident> {
    const r = this.repo.create(dto as any) as unknown as Resident;
    return this.repo.save(r);
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident> {
    const r = await this.findById(id);
    Object.assign(r, dto);
    return this.repo.save(r);
  }

  async archive(id: string): Promise<{ message: string }> {
    const r = await this.findById(id);
    r.isActive = false;
    (r as any).archivedAt = new Date();
    (r as any).archiveReason = 'Manually archived by admin';
    await this.repo.save(r);
    return { message: `${r.firstName} ${r.lastName}'s profile has been successfully archived` };
  }
}