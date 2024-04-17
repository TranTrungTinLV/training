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

  async findByIdAndPopulate(id: string): Promise<NewDocument> {
    return this.newModel.findById(id).populate('mode').populate('categories');
  }
  async findOneAndPopulate(
    filter: FilterQuery<NewDocument>,
  ): Promise<NewDocument> {
    return this.newModel
      .findById(filter)
      .populate('mode')
      .populate('categories');
  }
}
