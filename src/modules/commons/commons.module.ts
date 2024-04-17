import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { CommonsController } from './commons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Common } from './schemas/common.schema';
import { CommonSchema } from './schemas/common.schema';
import { CommonsRepository } from './commons.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Common.name, schema: CommonSchema }]),
  ],
  controllers: [CommonsController],
  providers: [CommonsService, CommonsRepository],
})
export class CommonsModule {}
