import { Injectable } from '@nestjs/common';
import { HistoriesRepository } from './histories.repository';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly historiesRepo: HistoriesRepository) {}

  async createHistory(payload: CreateHistoryDto) {
    return this.historiesRepo.create(payload);
  }
}
