import { Repository } from 'typeorm';
import { BlogPost } from './blog-post.entity';
export declare class CreateBlogDto {
    title: string;
    content: string;
    excerpt?: string;
    isPublished?: boolean;
}
export declare class BlogService {
    private repo;
    constructor(repo: Repository<BlogPost>);
    findAll(): Promise<BlogPost[]>;
    findPublished(): Promise<BlogPost[]>;
    findById(id: string): Promise<BlogPost>;
    create(dto: CreateBlogDto, authorId: string, authorName: string): Promise<BlogPost>;
    update(id: string, dto: Partial<CreateBlogDto>): Promise<BlogPost>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
