import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Injectable } from '@nestjs/common';
import { SlideShow, SlideShowDocument } from './schemas/slides-show.schema';

@Injectable()
export class SlidesShowRepository extends BaseRepository<SlideShowDocument> {
  constructor(
    @InjectModel(SlideShow.name)
    private readonly slideModel: Model<SlideShowDocument>,
  ) {
    super(slideModel);
  }

  async findOneAndPopulate(filterQuery: FilterQuery<SlideShowDocument>, path: string | string[]) {
    return this.slideModel.findOne(filterQuery).populate(path);
  }
}
