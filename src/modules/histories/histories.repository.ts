import { BaseRepository } from 'src/base.repository';
import { History, HistoryDocument } from './schemas/history.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HistoriesRepository extends BaseRepository<HistoryDocument> {
  constructor(
    @InjectModel(History.name)
    private readonly historyModel: Model<HistoryDocument>,
  ) {
    super(historyModel);
  }
}
