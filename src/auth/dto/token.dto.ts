import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    name: 'token',
    type: String,
    description: 'User token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
