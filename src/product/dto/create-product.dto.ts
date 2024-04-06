import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Shampoo',
    description: 'Name of the product',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '200',
    description: 'Price of the product',
    required: true,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: '5',
    description: 'Rating of the product',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: '100',
    description: 'Weight of the product',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    example: 'Shampoo for long hair',
    description: 'Features of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  features?: string;

  @ApiProperty({
    example: 'Natural shampoo',
    description: 'Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Hair',
    description: 'What the product is used for',
    required: false,
  })
  @IsString()
  @IsOptional()
  usingFor?: string;

  @ApiProperty({
    example: 'Shampoo, conditioner',
    description: 'Ingredients',
    required: false,
  })
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiProperty({
    example: 'For long hair',
    description: 'Product features',
    required: false,
  })
  @IsString()
  @IsOptional()
  productFeatures?: string;

  @ApiProperty({ example: '1', description: 'Category id', required: true })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    example: 'Not for children',
    description: 'Product warnings',
    required: false,
  })
  @IsOptional()
  @IsString()
  warning?: string;

  @IsOptional()
  createdAt?: string | Date;

  @IsOptional()
  updatedAt?: string | Date;

  // @IsOptional()
  // category: Prisma.CategoryCreateNestedOneWithoutProductsInput;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
        description: 'Images of the product',
      },
    },
  })
  @IsOptional()
  @IsString()
  images: string[];
}
