import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

export class UpdatePermissionDto {
  @ApiProperty() @IsString() featureKey: string;
  @ApiProperty() @IsBoolean() adminAccess: boolean;
  @ApiProperty() @IsBoolean() staffAccess: boolean;
  @ApiProperty() @IsBoolean() guardianAccess: boolean;
}

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all permission settings (super admin only)' })
  findAll() {
    return this.service.findAll();
  }

  @Get('my-access')
  @ApiOperation({ summary: 'Get feature access map for current user role' })
  myAccess(@Request() req) {
    return this.service.getAllForRole(req.user.role);
  }

  @Patch()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update feature permission (super admin only)' })
  update(@Body() dto: UpdatePermissionDto) {
    return this.service.update(dto);
  }
}
