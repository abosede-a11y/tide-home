import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  featureKey: string;

  @Column()
  featureLabel: string;

  @Column({ default: true })
  adminAccess: boolean;

  @Column({ default: false })
  staffAccess: boolean;

  @Column({ default: false })
  guardianAccess: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
