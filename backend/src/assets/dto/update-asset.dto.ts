import { IsEnum } from "class-validator";
import { AssetStatus } from "../../../generated/prisma/enums";

export class UpdateAssetStatusDto {
  @IsEnum(AssetStatus)
  status!: AssetStatus;
}
