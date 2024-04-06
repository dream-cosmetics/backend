import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product } from '@prisma/client';
import { FileImageDecorator } from 'src/shared/decorators/file.decorator';

import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteImageDto } from './dto/delete-image.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBody({
    type: CreateProductDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @FileImageDecorator('images', 3, 10)
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.createProduct(createProductDto, images);
  }

  @ApiQuery({
    name: 'order',
    type: String,
    enum: ['asc', 'desc'],
    required: false,
    description: 'Order of the products by creation date, default = desc',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
  })
  @Get()
  getProducts(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.productService.getProducts(order, limit, page);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Id of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Single product',
  })
  @Get(':id')
  getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Id of the product',
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Product updated successfully',
  })
  @FileImageDecorator('images', 3, 5)
  @Patch(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.updateProduct(+id, updateProductDto, images);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Id of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productService.removeProduct(+id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Id of the product',
  })
  @ApiBody({
    type: DeleteImageDto,
    required: true,
    description: 'Image name',
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
  })
  @Delete('image/:id')
  async deleteImage(
    @Param('id') id: number,
    @Body('imageName') imageName: string,
  ) {
    return this.productService.removeImage(id, imageName);
  }
}
