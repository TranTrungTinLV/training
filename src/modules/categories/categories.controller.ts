import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { IQuery } from 'src/common/interfaces';
import { Response } from 'express';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { Action } from 'src/common/enum/action.enum';
import { GetUserFromRequest } from 'src/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/categories.schema';
import { Model } from 'mongoose';

@Controller()
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  //* Home route
  @Get('/categories')
  async homeReadCategories(@Query() query: IQuery, @Res() res: Response) {
    res.status(200).json({
      msg: ' Get all sharing of categories success ',
      data: await this.categoriesService.readCategories(query),
    });
  }

  @Get('/categories/:categories_id/news')
  homeGetNewsOfCategories(
    @Param('categories_id') categories_id: string,
    @Query() query: IQuery,
  ) {
    return this.categoriesService.getNewsOfCategories(categories_id, query);
  }

  @Get('/categories/:id')
  homeReadCategory(@Param('id') id: string) {
    return this.categoriesService.getInfo(id);
  }

  //* Admin route
  @Get('/admin/categories')
  list(@Query() query) {
    return this.categoriesService.getAllCategories(query);
  }

  @Post('/admin/categories')
  create(@Body() body: CreateCategoryDto, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.categoryModel(),
    );
    return this.categoriesService.createCategory(body, user);
  }

  @Get('/admin/categories/:id')
  read(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.categoryModel(),
    );
    return this.categoriesService.getInfo(id);
  }

  @Put('/admin/categories/:id')
  update(
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.categoryModel(),
    );
    return this.categoriesService.updateCategory(id, updateCategoryDto, user);
  }

  @Delete('/admin/categories/:id')
  delete(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.categoryModel(),
    );
    return this.categoriesService.deleteCategory(id, user);
  }
}
