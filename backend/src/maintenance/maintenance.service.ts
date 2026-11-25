import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { AssetStatus, MaintenanceStatus, UserRole } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/browser';
import { AssignMaintenanceDto } from './dto/assign-maintenance.dto';
import { UpdateMaintenanceStatusDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMaintenanceDto, userId: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
      select: {
        id: true,
        assetTag: true,
        name: true,
        status: true,
      }
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.status === AssetStatus.RETIRED) {
      throw new BadRequestException('Cannot create maintenance record for a retired asset')
    }

    return this.prisma.maintenanceRecord.create({
      data: {
        assetId: dto.assetId,
        reportedById: userId,
        type: dto.type,
        description: dto.description,
        ...(dto.scheduledAt && {
          scheduledAt: new Date(dto.scheduledAt),
        })
      },
      select: {
        id: true,
        type: true,
        status: true,
        description: true,
        scheduledAt: true,
        createdAt: true,
        asset: {
          select: {
            assetTag: true,
            name: true,
            category: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }

  async findAll(user: { id: number; role: UserRole }) {
    let where: Prisma.MaintenanceRecordWhereInput = {}

    if (user.role === UserRole.IT_TECHNICIAN) {
        where = { assignedToId: user.id }
    } else if (user.role === UserRole.EMPLOYEE) {
        where = { reportedById: user.id }
    }

    return this.prisma.maintenanceRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        asset: {
          select: {
            id: true,
            assetTag: true,
            name: true,
            category: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
    });
  }

  async assign(id: number, dto: AssignMaintenanceDto) {
    const maintenance = await this.prisma.maintenanceRecord.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        assignedToId: true
      }
    })

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found')
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED || maintenance.status === MaintenanceStatus.CANCELLED) {
      throw new BadRequestException('Cannot assign a completed or cancelled maintenance record')
    }

    const technician = await this.prisma.user.findUnique({
      where: { id: dto.assignedToId },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found')
    }

    if (!technician.isActive) {
      throw new BadRequestException('Cannot assign maintenance to an inactive user')
    }

    if (technician.role !== UserRole.IT_TECHNICIAN) {
      throw new BadRequestException('Only IT technicians can be assigned to maintenance records.')
    }

    return this.prisma.maintenanceRecord.update({
      where: { id },
      data: { 
        assignedToId: technician.id,
       },
      select: {
        id: true,
        status: true,
        assignedToId: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    })
  }

  async updateStatus(id: number, dto: UpdateMaintenanceStatusDto) {
    const maintenance = await this.prisma.maintenanceRecord.findUnique({
      where: { id },
      select: {
        status: true,
        completedAt: true
      }
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found')
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED || maintenance.status === MaintenanceStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a completed or cancelled maintenance record')
    }

    if (maintenance.status === dto.status) {
      throw new BadRequestException('Maintenance record already has this status')
    }

    if (maintenance.status === MaintenanceStatus.IN_PROGRESS && dto.status === MaintenanceStatus.OPEN) {
      throw new BadRequestException('Cannot move an in-progress record back to open')
    }

    return this.prisma.maintenanceRecord.update({
      where: { id },
      data: {
        status: dto.status,
        completedAt: dto.status === MaintenanceStatus.COMPLETED ? new Date() : null
      },
      select: {
        id: true,
        status: true,
        completedAt: true,
        updatedAt: true,
      }
    });
  }
}
