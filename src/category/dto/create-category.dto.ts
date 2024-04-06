import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Beauty',
    description: 'Name of the category',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
