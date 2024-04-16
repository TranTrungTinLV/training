import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './schemas/history.schema';
import { HistoriesRepository } from './histories.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  controllers: [HistoriesController],
  providers: [HistoriesService, HistoriesRepository],
  exports: [HistoriesService],
})
export class HistoriesModule {}
