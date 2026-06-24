import { FaqService, CreateFaqDto } from './faq.service';
export declare class FaqController {
    private service;
    constructor(service: FaqService);
    findPublished(): Promise<import("./faq.entity").Faq[]>;
    findAll(): Promise<import("./faq.entity").Faq[]>;
    create(dto: CreateFaqDto): Promise<import("./faq.entity").Faq>;
    update(id: string, dto: Partial<CreateFaqDto>): Promise<import("./faq.entity").Faq>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
