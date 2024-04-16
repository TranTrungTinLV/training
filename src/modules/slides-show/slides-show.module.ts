import { Module, forwardRef } from '@nestjs/common';
import { SlidesShowService } from './slides-show.service';
import { SlidesShowController } from './slides-show.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SlideShow, SlideShowSchema } from './schemas/slides-show.schema';
import { SlidesShowRepository } from './slides-show.repository';
import { SlidesModule } from '../slides/slides.module';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SlideShow.name,
        schema: SlideShowSchema,
      },
    ]),
    forwardRef(() => SlidesModule),
    HistoriesModule,
  ],
  controllers: [SlidesShowController],
  providers: [SlidesShowService, SlidesShowRepository],
  exports: [SlidesShowService],
})
export class SlidesShowModule {}
