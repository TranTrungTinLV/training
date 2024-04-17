import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Pagination } from '../../common/utils/pagination.util';
import { formatSlug, isObjectId } from '../../common/utils';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async getAllCategories(query) {
    const categories = await this.getCategories(query);
    return categories;
  }

  async getInfo(idOrSlug: string) {
    let category = isObjectId(idOrSlug)
      ? await this.categoriesRepo.findById(idOrSlug)
      : await this.categoriesRepo.findOne({ slug: idOrSlug });
    if (!category) {
      throw new NotFoundException('Categories not found!');
    }
    category = await this.recursiveTree(category);
    return category;
  }

  async createCategory(body: CreateCategoryDto) {
    const { name, parent } = body;
    const newCategory = await this.categoriesRepo.create({
      name,
      slug: formatSlug(name, { isEdit: false }),
    });
    for (const cate of parent) {
      await this.categoriesRepo.findByIdAndUpdate(
        { _id: cate },
        {
          $push: { children: newCategory._id },
        },
        { new: true },
      );
    }
    return await this.categoriesRepo.find();
  }

  async updateCategory(id: string, body: UpdateCategoryDto) {
    const { name } = body;
    const categoryFound = await this.categoriesRepo.findById(id);
    if (!categoryFound) {
      throw new BadRequestException('Invalid Params');
    }
    await this.categoriesRepo.findByIdAndUpdate(
      id,
      {
        $set: { name: formatSlug(name, { isEdit: false }) },
      },
      { new: true },
    );
    return categoryFound;
  }

  async deleteCategory(id: string) {
    const categoryFound = await this.categoriesRepo.findByIdAndPopulate(
      id,
      'children',
    );
    if (!categoryFound) {
      throw new BadRequestException('Invalid param');
    }
    if (categoryFound.children.length > 0) {
      throw new BadRequestException(
        `Category currently have ${categoryFound.children.length} subcategories, cannot be deleted`,
      );
    }
    await categoryFound.deleteOne();
    return categoryFound;
  }

  async findById(id: string) {
    return this.categoriesRepo.findById(id);
  }

  async recursiveTree(data) {
    if (!data.toString().includes('_id')) {
      const item = await this.categoriesRepo.findById(data.toString());
      return this.recursiveTree(item);
    }
    const { children } = data;
    let result = [];
    if (children === undefined || children.length === 0) {
      result = [];
    } else {
      for (const element of children) {
        const item = await this.recursiveTree(element);
        result.push(item);
      }
    }
    return await { ...data._doc, children: result };
  }
  async getCategories(query) {
    const categories = new Pagination(
      this.categoriesRepo.findAndPopulate('children'),
      query,
    )
      .sorting()
      .filtering();
    const _categories = await categories.query;
    const result = [],
      cates = [];

    for (const element of _categories) {
      const item = await this.recursiveTree(element);
      result.push(item);
    }

    const size = result.length;
    for (let i = 0; i < size; i++) {
      let count = 0;
      for (let k = 0; k < size; k++) {
        if (result[k].children.length > 0) {
          result[k].children.forEach((value) => {
            value._id.toString() === result[i]._id.toString() ? count++ : count;
          });
        }
        result[k]._id.toString() === result[i]._id.toString() ? count++ : count;
        if (count === 2) `break`;
      }
      if (count <= 1) cates.push(result[i]);
    }
    return cates;
  }
}
