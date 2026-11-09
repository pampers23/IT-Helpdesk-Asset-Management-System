import { Controller, Post, UseGuards, Body, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '../../generated/prisma/enums';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.IT_TECHNICIAN)
  create(
    @CurrentUser('id') createdById: number,
    @Body() dto: CreateTicketDto
  ) {
    return this.ticketsService.create(dto, createdById);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN, UserRole.EMPLOYEE)
  findAll(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: UserRole
  ) {
    return this.ticketsService.findAll(userId, role);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  assignTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTicketDto
  ) {
    return this.ticketsService.assignTicket(id, dto)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.IT_TECHNICIAN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketStatusDto,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: UserRole
  ) {
    return this.ticketsService.updateStatus(id, userId, role, dto);
  }
}
