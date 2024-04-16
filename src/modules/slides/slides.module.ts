import { Module, forwardRef } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slide, SlideSchema } from './schemas/slide.schema';
import { SlidesRepository } from './schemas/slides.repository';
import { SlidesShowModule } from '../slides-show/slides-show.module';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slide.name, schema: SlideSchema }]),
    forwardRef(() => SlidesShowModule),
    HistoriesModule,
  ],
  controllers: [SlidesController],
  providers: [SlidesService, SlidesRepository],
  exports: [SlidesService],
})
export class SlidesModule {}
