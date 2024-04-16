import { InjectModel } from '@nestjs/mongoose';
import { Slide, SlideDocument } from './slide.schema';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlidesRepository extends BaseRepository<SlideDocument> {
  constructor(
    @InjectModel(Slide.name) private readonly slideModel: Model<SlideDocument>,
  ) {
    super(slideModel);
  }
}
