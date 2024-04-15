import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPassworDto {
  @ApiProperty({
    name: 'email',
    type: String,
    example: 'testmail@example.com',
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
