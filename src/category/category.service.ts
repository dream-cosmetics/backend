import { Injectable } from '@nestjs/common';
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

  async getCategoryById(categoryId: number): Promise<Category> {
    try {
      return await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
    } catch (e) {
      throw new Error(
        `Error: getting category with id:${categoryId} failed. Reason:${e}`,
      );
    }
  }

  async updateCategory(
    categoryId: number,
    data: UpdateCategoryDto,
  ): Promise<string> {
    try {
      await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data,
      });
      return `Category with id:${categoryId} updated successfully`;
    } catch (e) {
      throw new Error(
        `Error: updating category with id:${categoryId} failed.Reason:${e}`,
      );
    }
  }

  async removeCategory(categoryId: number): Promise<string> {
    try {
      await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return `Category with id:${categoryId} deleted successfully`;
    } catch (e) {
      throw new Error(
        `Error: deleting category with id:${categoryId} failed. Reason:${e}`,
      );
    }
  }
}
