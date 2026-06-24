import { BlogService, CreateBlogDto } from './blog.service';
export declare class BlogController {
    private service;
    constructor(service: BlogService);
    findPublished(): Promise<import("./blog-post.entity").BlogPost[]>;
    findAll(): Promise<import("./blog-post.entity").BlogPost[]>;
    create(dto: CreateBlogDto, req: any): Promise<import("./blog-post.entity").BlogPost>;
    update(id: string, dto: Partial<CreateBlogDto>): Promise<import("./blog-post.entity").BlogPost>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
