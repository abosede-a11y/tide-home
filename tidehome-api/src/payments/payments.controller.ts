import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService, CreatePaymentDto, UpdatePaymentDto, SendReceiptDto } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() { return this.service.findAll(); }

  @Get('summary')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  getSummary() { return this.service.getSummary(); }

  @Get('resident/:residentId')
  findByResident(@Param('residentId') id: string) { return this.service.findByResident(id); }

  @Get(':id/receipt')
  getReceipt(@Param('id') id: string) { return this.service.findById(id); }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @Request() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @Post(':id/send-receipt')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Send receipt to an email address' })
  sendReceipt(@Param('id') id: string, @Body() dto: SendReceiptDto) {
    return this.service.sendReceipt(id, dto);
  }
}