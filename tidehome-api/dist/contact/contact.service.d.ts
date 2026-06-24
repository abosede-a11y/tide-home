import { Repository } from 'typeorm';
import { ContactMessage } from './contact.entity';
export declare class ContactService {
    private repo;
    constructor(repo: Repository<ContactMessage>);
    create(data: Partial<ContactMessage>): Promise<ContactMessage>;
    findAll(): Promise<ContactMessage[]>;
    markRead(id: string): Promise<ContactMessage>;
    markReplied(id: string): Promise<ContactMessage>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getUnreadCount(): Promise<number>;
}
