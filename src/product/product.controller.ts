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
import { FileService } from '../file/file.service';
import { FileImageDecorator } from 'src/shared/decorators/file.decorator';
import { OrderQueryDto } from './dto/order-query.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService,
  ) {}

  @FileImageDecorator('images', 3, 5)
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.createProduct(createProductDto, images);
  }

  // @Post('image/:id')
  // @FileImageDecorator('images', 2, 10)
  // async setProductImage(
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  //   @Param('id') id: number,
  // ) {
  //   const fileNames = await this.fileService.uploadFiles(images);

  //   return this.productService.updateProduct(id, { images: fileNames });
  // }

  @Delete('image/:id')
  async deleteImage(
    @Param('id') id: number,
    @Body('imageName') imageName: string,
  ) {
    return this.productService.removeImage(id, imageName);
  }

  @Get()
  getProducts(@Query('order') order?: OrderQueryDto): Promise<Product[]> {
    return this.productService.getProducts(order as Prisma.SortOrderInput);
  }

  @Get(':id')
  getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @FileImageDecorator('images', 3, 5)
  @Patch(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productService.updateProduct(+id, updateProductDto, images);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productService.removeProduct(+id);
  }
}
