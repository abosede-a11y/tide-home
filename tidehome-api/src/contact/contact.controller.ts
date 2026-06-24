import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  // Public — no auth needed
  @Post()
  @ApiOperation({ summary: 'Submit contact form (public)' })
  create(@Body() body: any) {
    return this.service.create(body);
  }

  // Admin only below
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all contact messages' })
  findAll() { return this.service.findAll(); }

  @Get('unread-count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  getUnreadCount() { return this.service.getUnreadCount(); }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  markRead(@Param('id') id: string) { return this.service.markRead(id); }

  @Patch(':id/replied')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  markReplied(@Param('id') id: string) { return this.service.markReplied(id); }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  delete(@Param('id') id: string) { return this.service.delete(id); }
}