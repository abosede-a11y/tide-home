import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Faq } from './faq.entity';

export class CreateFaqDto {
  @ApiProperty() @IsString() question: string;
  @ApiProperty() @IsString() answer: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;
}

@Injectable()
export class FaqService {
  constructor(@InjectRepository(Faq) private repo: Repository<Faq>) {}

  findAll() { return this.repo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } }); }
  findPublished() { return this.repo.find({ where: { isPublished: true }, order: { sortOrder: 'ASC' } }); }

  async findById(id: string) {
    const f = await this.repo.findOne({ where: { id } });
    if (!f) throw new NotFoundException('FAQ not found');
    return f;
  }

  create(dto: CreateFaqDto) { return this.repo.save(this.repo.create(dto)); }

  async update(id: string, dto: Partial<CreateFaqDto>) {
    const f = await this.findById(id);
    Object.assign(f, dto);
    return this.repo.save(f);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { message: 'FAQ removed' };
  }
}
