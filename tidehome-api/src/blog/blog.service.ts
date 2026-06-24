import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogPost } from './blog-post.entity';

export class CreateBlogDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
}

@Injectable()
export class BlogService {
  constructor(@InjectRepository(BlogPost) private repo: Repository<BlogPost>) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  findPublished() { return this.repo.find({ where: { isPublished: true }, order: { createdAt: 'DESC' } }); }

  async findById(id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Post not found');
    return p;
  }

  create(dto: CreateBlogDto, authorId: string, authorName: string) {
    return this.repo.save(this.repo.create({ ...dto, authorId, authorName }));
  }

  async update(id: string, dto: Partial<CreateBlogDto>) {
    const p = await this.findById(id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { message: 'Post deleted' };
  }
}
