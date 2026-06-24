import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Import all entities explicitly
import { User } from '../users/user.entity';
import { Resident } from '../residents/resident.entity';
import { Medication } from '../medications/medication.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Payment } from '../payments/payment.entity';
import { BlogPost } from '../blog/blog-post.entity';
import { Faq } from '../faq/faq.entity';
import { Permission } from '../permissions/permission.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'tidehome',
  entities: [User, Resident, Medication, Appointment, Payment, BlogPost, Faq, Permission],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('🌱 Seeding database...');

  const userRepo = AppDataSource.getRepository(User);
  const residentRepo = AppDataSource.getRepository(Resident);

  // Super Admin
  const existing = await userRepo.findOne({ where: { email: 'superadmin@tidehome.co.uk' } });
  if (!existing) {
    await userRepo.save(userRepo.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@tidehome.co.uk',
      password: await bcrypt.hash('TideHome@2025!', 12),
      role: 'superadmin' as any,
      isActive: true,
    }));
    console.log('✅ Super Admin created: superadmin@tidehome.co.uk / TideHome@2025!');
  } else {
    console.log('⏭️  Super Admin already exists, skipping');
  }

  // Admin
  const adminExists = await userRepo.findOne({ where: { email: 'admin@tidehome.co.uk' } });
  if (!adminExists) {
    await userRepo.save(userRepo.create({
      firstName: 'Ada',
      lastName: 'Okafor',
      email: 'admin@tidehome.co.uk',
      password: await bcrypt.hash('Admin@2025!', 12),
      role: 'admin' as any,
      isActive: true,
    }));
    console.log('✅ Admin created: admin@tidehome.co.uk / Admin@2025!');
  } else {
    console.log('⏭️  Admin already exists, skipping');
  }

  // Staff
  const staffExists = await userRepo.findOne({ where: { email: 'staff@tidehome.co.uk' } });
  if (!staffExists) {
    await userRepo.save(userRepo.create({
      firstName: 'James',
      lastName: 'Eze',
      email: 'staff@tidehome.co.uk',
      password: await bcrypt.hash('Staff@2025!', 12),
      role: 'staff' as any,
      isActive: true,
    }));
    console.log('✅ Staff created: staff@tidehome.co.uk / Staff@2025!');
  } else {
    console.log('⏭️  Staff already exists, skipping');
  }

  // Sample resident
  const residentExists = await residentRepo.findOne({ where: { firstName: 'Margaret', lastName: 'Adeyemi' } });
  let resident: Resident;
  if (!residentExists) {
    resident = await residentRepo.save(residentRepo.create({
      firstName: 'Margaret',
      lastName: 'Adeyemi',
      dateOfBirth: '1942-03-15',
      roomNumber: '14',
      floor: 2,
      carePackage: 'Enhanced Care' as any,
      status: 'stable' as any,
      emergencyContact: 'Chioma Adeyemi',
      emergencyPhone: '+44 7700 900123',
      gpName: 'Dr. Patel',
      gpPhone: '+44 20 7946 0001',
      isActive: true,
    }));
    console.log('✅ Sample resident created: Margaret Adeyemi');
  } else {
    resident = residentExists;
    console.log('⏭️  Resident already exists, skipping');
  }

  // Guardian linked to resident
  const guardianExists = await userRepo.findOne({ where: { email: 'guardian@tidehome.co.uk' } });
  if (!guardianExists) {
    await userRepo.save(userRepo.create({
      firstName: 'Chioma',
      lastName: 'Adeyemi',
      email: 'guardian@tidehome.co.uk',
      password: await bcrypt.hash('Guardian@2025!', 12),
      role: 'guardian' as any,
      linkedResidentId: resident.id,
      isActive: true,
    }));
    console.log('✅ Guardian created: guardian@tidehome.co.uk / Guardian@2025!');
  } else {
    console.log('⏭️  Guardian already exists, skipping');
  }

  console.log('\n🌊 Seed complete! Test credentials:');
  console.log('  Super Admin: superadmin@tidehome.co.uk / TideHome@2025!');
  console.log('  Admin:       admin@tidehome.co.uk / Admin@2025!');
  console.log('  Staff:       staff@tidehome.co.uk / Staff@2025!');
  console.log('  Guardian:    guardian@tidehome.co.uk / Guardian@2025!\n');

  await AppDataSource.destroy();
}

seed().catch(e => { console.error(e); process.exit(1); });
