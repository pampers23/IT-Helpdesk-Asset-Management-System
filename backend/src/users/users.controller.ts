import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   findAll() {
    return this.usersService.findAll();
   }
   
}
