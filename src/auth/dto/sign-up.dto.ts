import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUpDto implements Prisma.UserCreateInput {
  @ApiProperty({
    name: 'firstName',
    type: String,
    description: 'User first name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    name: 'lastName',
    type: String,
    description: 'User last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'User email',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'phone',
    type: String,
    description: 'User phone',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  // @ApiProperty({
  //   name: 'Status',
  //   type: String,
  //   description: 'User status',
  //   example: 'PENDING',
  // })
  @IsIn(['USER', 'ADMIN'])
  @IsOptional()
  @IsEnum($Enums.Role)
  role: $Enums.Role;

  @IsIn(['ACTIVE', 'PENDING'])
  @IsOptional()
  @IsEnum($Enums.Status)
  status: $Enums.Status;

  @IsOptional()
  createdAt?: string | Date;
  @IsOptional()
  updatedAt?: string | Date;
}
