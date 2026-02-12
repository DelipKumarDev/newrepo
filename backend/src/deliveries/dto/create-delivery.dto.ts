import { IsMongoId, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateDeliveryDto {
  @IsMongoId()
  tenantId: string;

  @IsString()
  reference: string;

  @IsString()
  pickupAddress: string;

  @IsString()
  dropoffAddress: string;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsObject()
  pickupGeo?: { lat: number; lng: number; region?: string };

  @IsOptional()
  @IsObject()
  dropoffGeo?: { lat: number; lng: number; region?: string };
}
