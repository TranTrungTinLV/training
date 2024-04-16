import { Module, forwardRef } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { New, NewSchema } from './schemas/new.schema';
import { NewsRepository } from './news.repository';
import { CategoriesModule } from '../categories/categories.module';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: New.name, schema: NewSchema }]),
    forwardRef(() => CategoriesModule),
    HistoriesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
  exports: [NewsService],
})
export class NewsModule {}
