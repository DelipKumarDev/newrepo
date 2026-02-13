import { IsOptional, IsString, IsMongoId, IsNumber } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsString()
  podUrl?: string;
}
