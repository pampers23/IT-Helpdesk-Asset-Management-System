import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UserRole } from '../../generated/prisma/enums';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { AssignedAssetDto } from './dto/assign.asset.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  create(
    @Body() dto: CreateAssetDto
  ) {
    return this.assetsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.assetsService.findOne(id)
  }
  
  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignedAssetDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.assetsService.assign(id, dto, user)
  }

  @Patch(':id/unassign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  unassign(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number }
  ) {
    return this.assetsService.unassign(id, user);
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  getHistory(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.assetsService.getHistory(id);
  }
}
