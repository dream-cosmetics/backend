import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageDto {
  @ApiProperty({
    example: 'image.png',
    description: 'Name of the image',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;
}
