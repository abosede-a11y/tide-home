import { ContactService } from './contact.service';
export declare class ContactController {
    private service;
    constructor(service: ContactService);
    create(body: any): Promise<import("./contact.entity").ContactMessage>;
    findAll(): Promise<import("./contact.entity").ContactMessage[]>;
    getUnreadCount(): Promise<number>;
    markRead(id: string): Promise<import("./contact.entity").ContactMessage>;
    markReplied(id: string): Promise<import("./contact.entity").ContactMessage>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
