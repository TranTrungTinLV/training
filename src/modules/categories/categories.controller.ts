import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  list(@Query() query) {
    return this.categoriesService.getAllCategories(query);
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.categoriesService.getInfo(id);
  }
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.createCategory(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  deleteC(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
