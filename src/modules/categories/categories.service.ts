import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { formatSlug, isObjectId, Pagination } from '../../common/utils/index';
import { NewsService } from '../news/news.service';
import { modeNewsEnum } from '../news/schemas/enum/mode_news.enum';
import { IQuery } from 'src/common/interfaces';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';
import { CategoryDocument } from './schemas/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepo: CategoriesRepository,
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
    private readonly historiesService: HistoriesService,
  ) {}

  async readCategories(query: IQuery) {
    return await this.getCategories(query);
  }

  async getNewsOfCategories(categories_id: string, query) {
    const categories = categories_id
      ? categories_id.split(',').filter(Boolean)
      : [];

    const features = new Pagination(
      categories.length > 0
        ? this.newsService.findQuery({
            mode: modeNewsEnum.public,
            categories: { $in: categories },
          })
        : this.newsService.findQuery(),
      query,
    )
      .pagination()
      .searching()
      .sorting()
      .filtering();

    const featuresSearch = new Pagination(
      categories?.length > 0
        ? this.newsService.findQuery({
            mode: modeNewsEnum.public,
            categories: { $in: categories },
          })
        : this.newsService.findQuery(),
      query,
    ).searching();

    const [posts, numbersPost] = await Promise.all([
      features.query,
      featuresSearch.query,
    ]);

    return {
      data: posts,
      numbersPost: numbersPost.length,
    };
  }

  async getAllCategories(query) {
    const categories = await this.getCategories(query);
    return categories;
  }

  async getInfo(idOrSlug: string) {
    let category = isObjectId(idOrSlug)
      ? await this.categoriesRepo.findById(idOrSlug)
      : await this.categoriesRepo.findOne({ slug: idOrSlug });

    if (!category) {
      throw new NotFoundException('Categories not found');
    }
    category = await this.recursiveTree(category);

    return category;
  }

  async createCategory(
    body: CreateCategoryDto,
    user: IUserFromRequest,
  ): Promise<CategoryDocument[]> {
    const { name, parent } = body;

    const existingCategory = await this.categoriesRepo.countDocuments({ name });
    if (existingCategory >= 1) {
      throw new BadRequestException('Name already exists');
    }

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

    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Add new category (${name}) at sharing`,
    });

    return await this.categoriesRepo.find();
  }

  async updateCategory(
    id: string,
    body: UpdateCategoryDto,
    user: IUserFromRequest,
  ): Promise<CategoryDocument> {
    const { name } = body;

    const categoryFound = await this.categoriesRepo.findById(id);
    if (!categoryFound) {
      throw new BadRequestException('Categories not found');
    }

    const [categoryUpdated, newHistory] = await Promise.all([
      this.categoriesRepo.findByIdAndUpdate(
        id,
        {
          $set: { name, slug: formatSlug(name, { isEdit: false }) },
        },
        { new: true },
      ),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update info category (${name}) at sharing`,
      }),
    ]);

    return categoryUpdated;
  }

  async deleteCategory(id: string, user: IUserFromRequest): Promise<void> {
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

    await Promise.all([
      categoryFound.deleteOne(),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete category (${categoryFound._id}) at sharing`,
      }),
    ]);
  }

  async findById(id: string): Promise<CategoryDocument> {
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
