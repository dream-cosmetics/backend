import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Product } from '@prisma/client';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product: Product = await this.prisma.product.create({
        data: createProductDto,
      });
      return product;
    } catch (e) {
      throw new Error(`Error: creating product failed.Reason:${e}`);
    }
  }

  async getProducts(
    order: Prisma.SortOrderInput | Prisma.SortOrder,
  ): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: order,
        },
        include: {
          category: true,
        },
      });

      return products.map((product) => {
        return {
          ...product,
          images: this.fileService.getImageUrls(product.images),
        };
      });
    } catch (e) {
      throw new Error(`Error: getting all products failed. Reason:${e}`);
    }
  }

  async getProductByIdOr404(productId: number): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return {
        ...product,
        images: this.fileService.getImageUrls(product.images),
      };
    } catch (e) {
      throw new BadRequestException('Product not found');
    }
  }

  async updateProduct(productId: number, updateData: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: updateData,
      });
      return updatedProduct;
    } catch (e) {
      throw new BadRequestException('Product not found', e);
    }
  }

  async removeProduct(productId: number): Promise<string> {
    try {
      await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });
      return `Product with id:${productId} deleted successfully`;
    } catch (e) {
      throw new NotFoundException('Product not found', e);
    }
  }
}
