import { IsInt, Min } from "class-validator";

export class AssignMaintenanceDto {
  @IsInt()
  @Min(1)
  assignedToId: number;
}
