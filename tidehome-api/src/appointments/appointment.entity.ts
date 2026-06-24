import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AppointmentStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  MISSED = 'missed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() residentId: string;
  @Column() residentName: string;
  @Column() appointmentType: string;
  @Column() hospital: string;
  @Column({ type: 'timestamptz' }) scheduledAt: Date;
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.UPCOMING }) status: AppointmentStatus;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) outcome: string;
  @Column({ nullable: true }) createdById: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
