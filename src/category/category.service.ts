import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({ data });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Category already exists');
      }
      throw new Error(`Error: creating category failed.Reason:${e}`);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch (e) {
      throw new Error(`Error: getting all categories failed.Reason:${e}`);
    }
  }

  async getCategoryByIdOrThrow(categoryId: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new BadRequestException(`Category with id:${categoryId} not found`);
    }
    return category;
  }

  async updateCategory(
    categoryId: number,
    data: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryByIdOrThrow(categoryId);
    return await this.prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        ...data,
      },
    });
  }

  async removeCategory(categoryId: number) {
    const category = await this.getCategoryByIdOrThrow(categoryId);
    await this.prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    return {
      message: `Category with id:${categoryId} deleted successfully`,
    };
  }
}
