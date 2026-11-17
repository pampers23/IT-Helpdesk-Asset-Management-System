import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AssetCategory, AssetCondition } from '../../../generated/prisma/enums';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  assetTag!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(AssetCategory)
  category!: AssetCategory

  @IsEnum(AssetCondition)
  condition!: AssetCondition;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;
}
