import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    name: 'password',
    example: 'password',
    description: 'New password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'token',
    description: 'Token',
    type: String,
    example: 'Token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
