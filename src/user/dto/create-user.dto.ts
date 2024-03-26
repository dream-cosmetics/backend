import { $Enums, Prisma } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsEnum($Enums.Role)
  role: $Enums.Role;
  @IsOptional()
  createdAt?: string | Date;
  @IsOptional()
  updatedAt?: string | Date;
}
