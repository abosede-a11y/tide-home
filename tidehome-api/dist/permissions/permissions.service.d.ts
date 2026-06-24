import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from '../users/user.entity';
export declare class PermissionsService implements OnModuleInit {
    private repo;
    constructor(repo: Repository<Permission>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<Permission[]>;
    update(dto: {
        featureKey: string;
        adminAccess: boolean;
        staffAccess: boolean;
        guardianAccess: boolean;
    }): Promise<Permission>;
    getAllForRole(role: UserRole): Promise<Record<string, boolean>>;
}
