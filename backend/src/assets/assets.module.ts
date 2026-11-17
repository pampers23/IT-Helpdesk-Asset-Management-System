import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [PrismaModule],
})
export class AssetsModule {}
