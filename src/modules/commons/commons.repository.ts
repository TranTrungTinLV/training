import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Common, CommonDocument } from './schemas/common.schema';

@Injectable()
export class CommonsRepository extends BaseRepository<CommonDocument> {
  constructor(
    @InjectModel(Common.name)
    private readonly commonModel: Model<CommonDocument>,
  ) {
    super(commonModel);
  }
}
