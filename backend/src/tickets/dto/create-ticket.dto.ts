import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TicketPriority } from '../../../generated/prisma/enums';
import { TicketCategory } from '../../../generated/prisma/enums';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(TicketCategory)
  category!: TicketCategory;

  @IsEnum(TicketPriority)
  priority!: TicketPriority;
}