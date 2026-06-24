import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MedStatus {
  ON_TRACK = 'on_track',
  MISSED = 'missed',
  REVIEW = 'review_needed',
}

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() residentId: string;
  @Column() residentName: string;
  @Column() medicationName: string;
  @Column() dosage: string;
  @Column() frequency: string;
  @Column({ nullable: true }) instructions: string;
  @Column({ type: 'enum', enum: MedStatus, default: MedStatus.ON_TRACK }) status: MedStatus;
  @Column({ nullable: true }) lastGiven: Date;
  @Column({ nullable: true }) nextDue: Date;
  @Column({ nullable: true }) givenById: string;
  @Column({ nullable: true }) givenByName: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
