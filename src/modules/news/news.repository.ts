import { BaseRepository } from '../../base.repository';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { New, NewDocument } from './schemas/new.schema';

@Injectable()
export class NewsRepository extends BaseRepository<NewDocument> {
  constructor(
    @InjectModel(New.name)
    private readonly newModel: Model<NewDocument>,
  ) {
    super(newModel);
  }

  async findByIdAndPopulate(
    id: string,
    path: string | string[],
  ): Promise<NewDocument> {
    return this.newModel.findById(id).populate(path);
  }

  async findOneAndPopulate(
    filter: FilterQuery<NewDocument>,
    path: string | string[],
  ): Promise<NewDocument> {
    return this.newModel.findById(filter).populate(path);
  }
}
