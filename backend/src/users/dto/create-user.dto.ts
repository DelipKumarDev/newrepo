import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsMongoId()
  tenantId: string;

  @IsOptional()
  roles?: string[];
}
