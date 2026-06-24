import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MedicationsService, CreateMedicationDto, UpdateMedicationDto, LogDoseDto } from './medications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Medications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private service: MedicationsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'All medication records' })
  findAll() { return this.service.findAll(); }

  @Get('resident/:residentId')
  @ApiOperation({ summary: 'Medications for a resident' })
  findByResident(@Param('residentId') id: string) { return this.service.findByResident(id); }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add medication record' })
  create(@Body() dto: CreateMedicationDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update medication record' })
  update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/log-dose')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Log a dose given' })
  logDose(@Param('id') id: string, @Body() dto: LogDoseDto, @Request() req) {
    return this.service.logDose(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove medication record' })
  deactivate(@Param('id') id: string) { return this.service.deactivate(id); }
}
