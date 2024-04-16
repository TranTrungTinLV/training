import { BaseRepository } from '../../base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './schemas/categories.schema';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoriesModel: Model<CategoryDocument>,
  ) {
    super(categoriesModel);
  }

  findAndPopulate(path: string): Promise<CategoryDocument[]> {
    return this.categoriesModel.find().populate(path);
  }

  findByIdAndPopulate(id: string, path: string): Promise<CategoryDocument> {
    return this.categoriesModel.findById(id).populate(path);
  }
}
