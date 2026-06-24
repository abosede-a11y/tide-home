import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private repo: Repository<ContactMessage>,
  ) {}

  async create(data: Partial<ContactMessage>): Promise<ContactMessage> {
    const msg = this.repo.create(data);
    return this.repo.save(msg);
  }

  findAll(): Promise<ContactMessage[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async markRead(id: string): Promise<ContactMessage> {
    const msg = await this.repo.findOne({ where: { id } });
    msg.isRead = true;
    return this.repo.save(msg);
  }

  async markReplied(id: string): Promise<ContactMessage> {
    const msg = await this.repo.findOne({ where: { id } });
    msg.isRead = true;
    msg.isReplied = true;
    return this.repo.save(msg);
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.repo.delete(id);
    return { message: 'Message deleted' };
  }

  async getUnreadCount(): Promise<number> {
    return this.repo.count({ where: { isRead: false } });
  }
}