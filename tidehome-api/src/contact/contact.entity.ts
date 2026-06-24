import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() firstName: string;
  @Column({ nullable: true }) lastName: string;
  @Column() email: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) subject: string;
  @Column({ type: 'text' }) message: string;
  @Column({ default: false }) isRead: boolean;
  @Column({ default: false }) isReplied: boolean;
  @CreateDateColumn() createdAt: Date;
}