import { IsEnum } from "class-validator";
import { MaintenanceStatus } from "../../../generated/prisma/enums";

export class UpdateMaintenanceStatusDto {
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;
}
