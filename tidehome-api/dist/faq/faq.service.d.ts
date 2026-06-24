import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
export declare class CreateFaqDto {
    question: string;
    answer: string;
    isPublished?: boolean;
    sortOrder?: number;
}
export declare class FaqService {
    private repo;
    constructor(repo: Repository<Faq>);
    findAll(): Promise<Faq[]>;
    findPublished(): Promise<Faq[]>;
    findById(id: string): Promise<Faq>;
    create(dto: CreateFaqDto): Promise<Faq>;
    update(id: string, dto: Partial<CreateFaqDto>): Promise<Faq>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
