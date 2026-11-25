import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { MaintenanceType } from "../../../generated/prisma/enums";

export class CreateMaintenanceDto {
  @IsInt()
  @Min(1)
  assetId: number;

  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}
