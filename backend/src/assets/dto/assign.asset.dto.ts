import { IsInt, Min } from "class-validator";

export class AssignedAssetDto {
  @IsInt()
  @Min(1)
  assignedToId!: number;
}
