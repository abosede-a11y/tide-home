import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ResidentStatus {
  STABLE = 'stable',
  MONITORING = 'monitoring',
  ATTENTION = 'attention',
  CRITICAL = 'critical',
}

export enum CarePackage {
  STANDARD = 'Standard Care',
  ENHANCED = 'Enhanced Care',
  PREMIUM = 'Premium Care',
}

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ type: 'date' }) dateOfBirth: string;
  @Column({ nullable: true }) roomNumber: string;
  @Column({ nullable: true }) floor: number;
  @Column({ type: 'enum', enum: CarePackage, default: CarePackage.STANDARD })
  carePackage: CarePackage;
  @Column({ type: 'enum', enum: ResidentStatus, default: ResidentStatus.STABLE })
  status: ResidentStatus;
  @Column({ nullable: true }) photoUrl: string;
  @Column({ nullable: true }) medicalHistory: string;
  @Column({ nullable: true }) allergies: string;
  @Column({ nullable: true }) emergencyContact: string;
  @Column({ nullable: true }) emergencyPhone: string;
  @Column({ nullable: true }) gpName: string;
  @Column({ nullable: true }) gpPhone: string;
  @Column({ nullable: true }) notes: string;
  // Guardian user ID linked to this resident
  @Column({ nullable: true }) guardianUserId: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ nullable: true })
  archivedAt: Date;
  @Column({ nullable: true })
  archiveReason: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
