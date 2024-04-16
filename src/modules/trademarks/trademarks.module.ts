import { Module } from '@nestjs/common';
import { TrademarksService } from './trademarks.service';
import { TrademarksController } from './trademarks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trademark, TrademarkSchema } from './schemas/trademark.schema';
import { TrademarksRepository } from './trademarks.repository';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trademark.name, schema: TrademarkSchema },
    ]),
    HistoriesModule,
  ],
  controllers: [TrademarksController],
  providers: [TrademarksService, TrademarksRepository],
})
export class TrademarksModule {}
