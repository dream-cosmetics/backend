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

  async createProduct(
    createProductDto: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const imageNames = await this.fileService.uploadFiles(images);
      const product: Product = await this.prisma.product.create({
        data: { ...createProductDto, images: imageNames },
      });
      return product;
    } catch (e) {
      throw new Error(`Error: creating product failed.Reason:${e}`);
    }
  }

  async getProducts(order: 'asc' | 'desc' = 'desc', limit = 3, page = 1) {
    const count = await this.prisma.product.count();
    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: order,
      },
      include: {
        category: true,
      },
      take: limit || 3,
      skip: skip || 0,
    });

    return products.map((product) => {
      return {
        ...product,
        images: this.fileService.getImageUrls(product.images),
        count,
        page: page || 1,
        pages: Math.ceil(count / limit) || 1,
      };
    });
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
      return product;
    } catch (e) {
      throw new BadRequestException('Product not found');
    }
  }

  async findOne(productId: number): Promise<Product> {
    const product = await this.getProductByIdOr404(productId);
    return {
      ...product,
      images: this.fileService.getImageUrls(product.images),
    };
  }

  async updateProduct(
    productId: number,
    updateData: UpdateProductDto,
    images: Express.Multer.File[],
  ) {
    try {
      const product = await this.getProductByIdOr404(productId);
      const fileNames = await this.fileService.uploadFiles(images);
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          ...updateData,
          images: {
            push: fileNames,
          },
        },
      });
      return updatedProduct;
    } catch (e) {
      throw new BadRequestException('Product not found', e);
    }
  }

  async removeProduct(productId: number): Promise<string> {
    try {
      const productToRemove = await this.getProductByIdOr404(productId);
      await this.prisma.product.delete({
        where: {
          id: productToRemove.id,
        },
      });
      await this.fileService.removeFiles(productToRemove.images);

      return `Product with id:${productId} deleted successfully`;
    } catch (e) {
      throw new NotFoundException('Product not found', e);
    }
  }

  async removeImage(productId: number, imageName: string) {
    const product = await this.getProductByIdOr404(productId);
    await this.fileService.removeFile(imageName);
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        images: {
          set: product.images.filter((img) => img !== imageName),
        },
      },
    });
    return updatedProduct;
  }
}
