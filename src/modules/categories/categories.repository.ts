import { BaseRepository } from '../../base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Categories, CategoriesDocument } from './schemas/categories.schema';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoriesDocument> {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoriesModel: Model<CategoriesDocument>,
  ) {
    super(categoriesModel);
  }

  findAndPopulate(path: string) {
    return this.categoriesModel.find({}).populate(path);
  }
  findByIdAndPopulate(id: string, path: string) {
    return this.categoriesModel.findById(id).populate(path);
  }
}
