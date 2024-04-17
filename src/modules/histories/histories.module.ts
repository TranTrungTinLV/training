import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';

@Module({
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
