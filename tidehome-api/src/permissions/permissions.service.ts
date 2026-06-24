import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from '../users/user.entity';

const DEFAULT_PERMISSIONS = [
  { featureKey: 'dashboard',    featureLabel: 'Dashboard',        adminAccess: true,  staffAccess: true,  guardianAccess: true  },
  { featureKey: 'residents',    featureLabel: 'Residents',         adminAccess: true,  staffAccess: true,  guardianAccess: false },
  { featureKey: 'medications',  featureLabel: 'Medications',       adminAccess: true,  staffAccess: true,  guardianAccess: false },
  { featureKey: 'appointments', featureLabel: 'Hospital Visits',   adminAccess: true,  staffAccess: true,  guardianAccess: true  },
  { featureKey: 'payments',     featureLabel: 'Payments',          adminAccess: true,  staffAccess: false, guardianAccess: true  },
  { featureKey: 'profile',      featureLabel: 'My Profile',        adminAccess: true,  staffAccess: true,  guardianAccess: true  },
  { featureKey: 'livechat',     featureLabel: 'Live Chat/Support', adminAccess: true,  staffAccess: true,  guardianAccess: true  },
  { featureKey: 'blog',         featureLabel: 'Blog Manager',      adminAccess: true,  staffAccess: false, guardianAccess: false },
  { featureKey: 'faqadmin',     featureLabel: 'FAQ Manager',       adminAccess: true,  staffAccess: false, guardianAccess: false },
  { featureKey: 'users',        featureLabel: 'User Accounts',     adminAccess: true,  staffAccess: false, guardianAccess: false },
];

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private repo: Repository<Permission>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      for (const p of DEFAULT_PERMISSIONS) {
        await this.repo.save(this.repo.create(p));
      }
    }
  }

  findAll(): Promise<Permission[]> {
    return this.repo.find({ order: { featureKey: 'ASC' } });
  }

  async update(dto: { featureKey: string; adminAccess: boolean; staffAccess: boolean; guardianAccess: boolean }): Promise<Permission> {
    let p = await this.repo.findOne({ where: { featureKey: dto.featureKey } });
    if (!p) {
      p = this.repo.create(dto);
    } else {
      Object.assign(p, dto);
    }
    return this.repo.save(p);
  }

  async getAllForRole(role: UserRole): Promise<Record<string, boolean>> {
    if (role === UserRole.SUPER_ADMIN) {
      const all = await this.findAll();
      return Object.fromEntries(all.map(p => [p.featureKey, true]));
    }
    const all = await this.findAll();
    const result: Record<string, boolean> = {};
    all.forEach(p => {
      if (role === UserRole.ADMIN) result[p.featureKey] = p.adminAccess;
      else if (role === UserRole.STAFF) result[p.featureKey] = p.staffAccess;
      else if (role === UserRole.GUARDIAN) result[p.featureKey] = p.guardianAccess;
      else result[p.featureKey] = false;
    });
    return result;
  }
}
