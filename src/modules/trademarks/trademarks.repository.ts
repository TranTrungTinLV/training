import { BaseRepository } from '../../base.repository';
import { Trademark, TrademarkDocument } from './schemas/trademark.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TrademarksRepository extends BaseRepository<TrademarkDocument> {
  constructor(
    @InjectModel(Trademark.name)
    private readonly trademarkModel: Model<TrademarkDocument>,
  ) {
    super(trademarkModel);
  }
}
