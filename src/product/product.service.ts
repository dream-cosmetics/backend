import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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
      return await this.prisma.product.findMany({
        orderBy: {
          createdAt: order,
        },
        include: {
          category: true,
        },
      });
    } catch (e) {
      throw new Error(`Error: getting all products failed. Reason:${e}`);
    }
  }

  async getProductById(productId: number): Promise<Product> {
    try {
      return await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
    } catch (e) {
      throw new Error(
        `Error: getting product with id:${productId} failed. Reason:${e}`,
      );
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
      throw new Error(
        `Error: updating product with id:${productId} failed. Reason:${e}`,
      );
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
      throw new Error(
        `Error: deleting product with id:${productId} failed. Reason:${e}`,
      );
    }
  }
}
