import { Module, forwardRef } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/categories.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesRepository } from './categories.repository';
import { NewsModule } from '../news/news.module';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => NewsModule),
    HistoriesModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
