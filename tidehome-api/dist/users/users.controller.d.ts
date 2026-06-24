import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AdminUpdateUserDto, ChangePasswordDto } from './user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    getMe(req: any): Promise<import("./user.entity").User>;
    create(dto: CreateUserDto, req: any): Promise<import("./user.entity").User>;
    updateMe(req: any, dto: UpdateUserDto): Promise<import("./user.entity").User>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<import("./user.entity").User>;
    resendCredentials(id: string): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
}
