import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    rating: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    weight: number;

    @IsString()
    @IsOptional()
    features: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    usingFor: string;

    @IsString()
    @IsOptional()
    ingredients: string;

    @IsString()
    @IsOptional()
    productFeatures: string;

    @IsString()
    @IsOptional()
    warnings: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    categoryId: number;
}
