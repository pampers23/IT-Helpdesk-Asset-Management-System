
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetStatus, Prisma, UserRole } from '../../generated/prisma/client';
import { AssignedAssetDto } from './dto/assign.asset.dto';
import { AssetHistoryAction } from '../../generated/prisma/enums';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    try {
      const asset = await this.prisma.asset.create({
        data: {
          assetTag: dto.assetTag,
          name: dto.name,
          description: dto.description,
          category: dto.category,
          serialNumber: dto.serialNumber,
          brand: dto.brand,
          model: dto.model,
          condition: dto.condition,
        },
      });

      return asset;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Asset tag or serial number already exists',
        );
      }

      throw error;
    }
  }

  async findAll() {
    const assets = await this.prisma.asset.findMany({
      select: {
        id: true,
        assetTag: true,
        name: true,
        description: true,
        category: true,
        serialNumber: true,
        brand: true,
        model: true,
        status: true,
        condition: true,
        createdAt: true,
        updatedAt: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })
    return assets;
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    })

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  
  async assign(id: number, dto: AssignedAssetDto, user: { id: number }) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    const assignee = await this.prisma.user.findFirst({
      where: {
        id: dto.assignedToId,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
    });

    if (!assignee) {
      throw new NotFoundException('Active employee not found');
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new ConflictException('Asset is not available for assignment');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id },
        data: {
          assignedToId: dto.assignedToId,
          status: AssetStatus.ASSIGNED,
        },
      });

      await tx.assetHistory.create({
        data: {
          action: AssetHistoryAction.ASSIGNED,
          assetId: id,
          employeeId: dto.assignedToId,
          performedById: user.id,
        },
      });

      return updatedAsset;
    });
  }


  
  async unassign(id: number, user: { id: number }) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException('Asset does not exist');
    }

    if (asset.status !== AssetStatus.ASSIGNED || !asset.assignedToId) {
      throw new ConflictException('Asset is not assigned');
    }

    // Preserve the previous employee's ID
    const previousEmployeeId = asset.assignedToId;

    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id },
        data: {
          assignedToId: null,
          status: AssetStatus.AVAILABLE,
        },
      });

      await tx.assetHistory.create({
        data: {
          action: AssetHistoryAction.UNASSIGNED,
          assetId: id,
          employeeId: previousEmployeeId,
          performedById: user.id,
        },
      });

      return updatedAsset;
    });
  }

  async getHistory(id: number) {
    const asset = await this.prisma.asset.findMany({
      where: { id },
    });

    const history = await this.prisma.assetHistory.findMany({
      where: { assetId: id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (history.length === 0) {
      throw new NotFoundException('History not found');
    }

    return history;
  }
}
