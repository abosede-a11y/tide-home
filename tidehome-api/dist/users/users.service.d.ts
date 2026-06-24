import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto, AdminUpdateUserDto, ChangePasswordDto } from './user.dto';
import { MailService } from '../common/mail.service';
export declare class UsersService {
    private usersRepo;
    private mailService;
    constructor(usersRepo: Repository<User>, mailService: MailService);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    create(dto: CreateUserDto, creatorRole: UserRole): Promise<User>;
    updateProfile(id: string, dto: UpdateUserDto): Promise<User>;
    adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User>;
    changePassword(id: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    resendCredentials(id: string): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
    updateLastLogin(id: string): Promise<void>;
    createDirect(data: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        role: UserRole;
    }): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
}
