import { PermissionsService } from './permissions.service';
export declare class UpdatePermissionDto {
    featureKey: string;
    adminAccess: boolean;
    staffAccess: boolean;
    guardianAccess: boolean;
}
export declare class PermissionsController {
    private service;
    constructor(service: PermissionsService);
    findAll(): Promise<import("./permission.entity").Permission[]>;
    myAccess(req: any): Promise<Record<string, boolean>>;
    update(dto: UpdatePermissionDto): Promise<import("./permission.entity").Permission>;
}
