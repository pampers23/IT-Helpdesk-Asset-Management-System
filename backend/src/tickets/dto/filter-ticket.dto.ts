import { IsEnum, IsOptional, IsString } from "class-validator";
import { TicketCategory, TicketPriority, TicketStatus } from "../../../generated/prisma/enums";

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
}
