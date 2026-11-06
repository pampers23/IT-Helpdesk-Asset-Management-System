import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserRole } from '../../generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto, createdById: number) {
    const ticket = await this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority,
        createdById
      }
    })
    return ticket;
  }

  async findAll(createdById: number, role: UserRole) {
    let where: Prisma.TicketWhereInput = {};

    if (role === UserRole.EMPLOYEE) {
      where = {
        createdById: createdById,
      };
    } else if (role === UserRole.IT_TECHNICIAN) {
      where ={
        assignedToId: createdById,
      };
    }

     return this.prisma.ticket.findMany({
      where: where,
       orderBy: {
         createdAt: 'desc'
       },
       select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          status: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            }
          },
          createdAt: true,
          updatedAt: true,
          assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          }
        }
       },
    });
  }

   async assignTicket (ticketId: number, dto: AssignTicketDto) {
     const ticket = await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        }
     });

     if (!ticket) {
       throw new NotFoundException("Not Found")
     }

     const user = await this.prisma.user.findUnique({
        where: {
          id: dto.assignedToId,
        }
     });

     if (!user) {
      throw new NotFoundException("User does not exist");
     }

     if (user.role !== UserRole.IT_TECHNICIAN) {
        throw new ForbiddenException('User is not an IT Technician')
     }

     if (!user.isActive) {
        throw new BadRequestException('Technician account is inactive')
     }

     return this.prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          assignedToId: dto.assignedToId
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            }
          }
        }
     });
   }
}
