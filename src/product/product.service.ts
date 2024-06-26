import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { ImagekitService } from 'src/imagekit/imagekit.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private imagekitService: ImagekitService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const { fileIds, urls } = await this.imagekitService.uploadFiles(images);
      const product: Product = await this.prisma.product.create({
        data: { ...createProductDto, images: fileIds, imageUrls: urls },
      });
      return product;
    } catch (e) {
      throw new Error(`Error: creating product failed.Reason:${e}`);
    }
  }

  async getProducts(order: 'asc' | 'desc' = 'desc', limit = 10, page = 1) {
    const count = await this.prisma.product.count();
    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: order,
      },
      include: {
        category: true,
      },
      take: limit || undefined,
      skip: skip || undefined,
    });

    return {
      products,
      count,
      page: Math.max(page, 1) || 1,
      pages: Math.ceil(count / limit) || 1,
    };
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
    };
  }

  async updateProduct(
    productId: number,
    updateData: UpdateProductDto,
    images: Express.Multer.File[],
  ) {
    try {
      const product = await this.getProductByIdOr404(productId);

      const { fileIds, urls } = await this.imagekitService.uploadFiles(images);

      const updatedProduct = await this.prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          ...updateData,
          images: {
            push: fileIds,
          },
          imageUrls: {
            push: urls,
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

      await this.imagekitService.deleteFiles(productToRemove.images);

      return `Product with id:${productId} deleted successfully`;
    } catch (e) {
      throw new NotFoundException('Product not found', e);
    }
  }

  async removeImage(productId: number, imageName: string) {
    const product = await this.getProductByIdOr404(productId);
    const { fileId, url } = await this.imagekitService.getFile(imageName);
    await this.imagekitService.deleteFile(imageName);

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        images: {
          set: product.images.filter((img) => img !== fileId),
        },
        imageUrls: {
          set: product.imageUrls.filter((img) => img !== url),
        },
      },
    });
    return updatedProduct;
  }
}
