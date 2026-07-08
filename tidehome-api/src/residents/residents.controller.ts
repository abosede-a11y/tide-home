import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResidentsService, CreateResidentDto, UpdateResidentDto } from './residents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private service: ResidentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all residents' })
  findAll() { return this.service.findAll(); }

  @Get('my-residents')
  @Roles(UserRole.GUARDIAN)
  @ApiOperation({ summary: 'Guardian: get linked resident(s)' })
  myResidents(@Request() req) {
    return this.service.findByGuardian(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single resident by ID' })
  findOne(@Param('id') id: string) { return this.service.findById(id); }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new resident record' })
  create(@Body() dto: CreateResidentDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update resident record' })
  update(@Param('id') id: string, @Body() dto: UpdateResidentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@ApiOperation({ summary: 'Archive resident' })
archive(@Param('id') id: string) { return this.service.archive(id); }

@Get('archived')
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@ApiOperation({ summary: 'Get all archived residents' })
findArchived() { return this.service.findArchived(); }
}
