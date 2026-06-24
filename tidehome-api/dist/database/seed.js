"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../users/user.entity");
const resident_entity_1 = require("../residents/resident.entity");
const medication_entity_1 = require("../medications/medication.entity");
const appointment_entity_1 = require("../appointments/appointment.entity");
const payment_entity_1 = require("../payments/payment.entity");
const blog_post_entity_1 = require("../blog/blog-post.entity");
const faq_entity_1 = require("../faq/faq.entity");
const permission_entity_1 = require("../permissions/permission.entity");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'tidehome',
    entities: [user_entity_1.User, resident_entity_1.Resident, medication_entity_1.Medication, appointment_entity_1.Appointment, payment_entity_1.Payment, blog_post_entity_1.BlogPost, faq_entity_1.Faq, permission_entity_1.Permission],
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('🌱 Seeding database...');
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const residentRepo = AppDataSource.getRepository(resident_entity_1.Resident);
    const existing = await userRepo.findOne({ where: { email: 'superadmin@tidehome.co.uk' } });
    if (!existing) {
        await userRepo.save(userRepo.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@tidehome.co.uk',
            password: await bcrypt.hash('TideHome@2025!', 12),
            role: 'superadmin',
            isActive: true,
        }));
        console.log('✅ Super Admin created: superadmin@tidehome.co.uk / TideHome@2025!');
    }
    else {
        console.log('⏭️  Super Admin already exists, skipping');
    }
    const adminExists = await userRepo.findOne({ where: { email: 'admin@tidehome.co.uk' } });
    if (!adminExists) {
        await userRepo.save(userRepo.create({
            firstName: 'Ada',
            lastName: 'Okafor',
            email: 'admin@tidehome.co.uk',
            password: await bcrypt.hash('Admin@2025!', 12),
            role: 'admin',
            isActive: true,
        }));
        console.log('✅ Admin created: admin@tidehome.co.uk / Admin@2025!');
    }
    else {
        console.log('⏭️  Admin already exists, skipping');
    }
    const staffExists = await userRepo.findOne({ where: { email: 'staff@tidehome.co.uk' } });
    if (!staffExists) {
        await userRepo.save(userRepo.create({
            firstName: 'James',
            lastName: 'Eze',
            email: 'staff@tidehome.co.uk',
            password: await bcrypt.hash('Staff@2025!', 12),
            role: 'staff',
            isActive: true,
        }));
        console.log('✅ Staff created: staff@tidehome.co.uk / Staff@2025!');
    }
    else {
        console.log('⏭️  Staff already exists, skipping');
    }
    const residentExists = await residentRepo.findOne({ where: { firstName: 'Margaret', lastName: 'Adeyemi' } });
    let resident;
    if (!residentExists) {
        resident = await residentRepo.save(residentRepo.create({
            firstName: 'Margaret',
            lastName: 'Adeyemi',
            dateOfBirth: '1942-03-15',
            roomNumber: '14',
            floor: 2,
            carePackage: 'Enhanced Care',
            status: 'stable',
            emergencyContact: 'Chioma Adeyemi',
            emergencyPhone: '+44 7700 900123',
            gpName: 'Dr. Patel',
            gpPhone: '+44 20 7946 0001',
            isActive: true,
        }));
        console.log('✅ Sample resident created: Margaret Adeyemi');
    }
    else {
        resident = residentExists;
        console.log('⏭️  Resident already exists, skipping');
    }
    const guardianExists = await userRepo.findOne({ where: { email: 'guardian@tidehome.co.uk' } });
    if (!guardianExists) {
        await userRepo.save(userRepo.create({
            firstName: 'Chioma',
            lastName: 'Adeyemi',
            email: 'guardian@tidehome.co.uk',
            password: await bcrypt.hash('Guardian@2025!', 12),
            role: 'guardian',
            linkedResidentId: resident.id,
            isActive: true,
        }));
        console.log('✅ Guardian created: guardian@tidehome.co.uk / Guardian@2025!');
    }
    else {
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
//# sourceMappingURL=seed.js.map