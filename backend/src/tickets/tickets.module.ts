import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  providers: [TicketsService],
  controllers: [TicketsController],
  imports: [PrismaModule],
})
export class TicketsModule {}
