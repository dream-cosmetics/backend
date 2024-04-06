import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of categories',
  })
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category id',
  })
  @ApiResponse({
    status: 200,
    description: 'Get single category',
  })
  @Get(':id')
  getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category id',
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Updated category',
  })
  @Patch(':id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted category',
  })
  @Delete(':id')
  removeCategory(@Param('id') id: number) {
    return this.categoryService.removeCategory(+id);
  }
}
