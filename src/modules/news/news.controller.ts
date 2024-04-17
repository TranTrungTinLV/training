import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { multerOptions } from '../../config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateNewsDto,
  ) {
    return this.newsService.createNew(image, body);
  }

  @Get()
  list() {
    return this.newsService.findAllNews();
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.newsService.getInfo(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.updateNew(image, id, updateNewsDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.newsService.deleteNew(id);
  }
}
