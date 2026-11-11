import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { TicketCategory, TicketPriority, TicketStatus } from "../../../generated/prisma/enums";
import { Type } from "class-transformer";

export enum TicketSortBy {
  createdAt = 'createdAt',
  priority = 'priority',
  status = 'status',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @IsOptional()
  @IsString()
  search?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(TicketSortBy)
  sortBy?: TicketSortBy = TicketSortBy.createdAt;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.desc;
}
