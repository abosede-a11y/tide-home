import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text' }) content: string;
  @Column({ nullable: true }) excerpt: string;
  @Column({ default: false }) isPublished: boolean;
  @Column({ nullable: true }) authorId: string;
  @Column({ nullable: true }) authorName: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
