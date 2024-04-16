import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { CommonsController } from './commons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Common } from './schemas/common.schema';
import { CommonSchema } from './schemas/common.schema';
import { CommonsRepository } from './commons.repository';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Common.name, schema: CommonSchema }]),
    HistoriesModule,
  ],
  controllers: [CommonsController],
  providers: [CommonsService, CommonsRepository],
})
export class CommonsModule {}
