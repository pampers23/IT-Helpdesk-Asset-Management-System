import { Controller, Post, UseGuards, Body, Get, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UserRole } from '../../generated/prisma/enums';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AssignMaintenanceDto } from './dto/assign-maintenance.dto';
import { UpdateMaintenanceStatusDto } from './dto/update-maintenance.dto';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  create(
    @Body() dto: CreateMaintenanceDto,
    @CurrentUser() user: { id: number }
  ) {
    return this.maintenanceService.create(dto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN, UserRole.EMPLOYEE)
  findAll(
    @CurrentUser() user: { id: number, role: UserRole }
  ) {
    return this.maintenanceService.findAll(user);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignMaintenanceDto
  ) {
    return this.maintenanceService.assign(id, dto)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceStatusDto,
  ) {
    return this.maintenanceService.updateStatus(id, dto);
  }
}
