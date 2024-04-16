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
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/index';
import { multerOptions } from '../../common/config/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { IQuery } from 'src/common/interfaces';
import { Response } from 'express';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';
import { Action } from 'src/common/enum/action.enum';
import { New, NewDocument } from './schemas/new.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Controller()
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    @InjectModel(New.name) private readonly newModel: Model<NewDocument>,
  ) {}

  //* Home route
  @Get('/news')
  async homeListNews(@Query() query: IQuery, @Res() res: Response) {
    const listNews = await this.newsService.homeReadNews(query);

    res.status(200).json({
      msg: 'Get all sharing success !',
      data: listNews.data,
      numbersPost: listNews.numbers,
    });
  }

  @Get('/news/:id')
  homeReadNew(@Param('id', ParserObjectIdPipe) id: string) {
    return this.newsService.readNew(id);
  }

  //* Admin route
  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/news')
  list(@Query() query, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.newModel(),
    );
    return this.newsService.readNews(query);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/news')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateNewsDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.newModel(),
    );
    return this.newsService.createNew(image, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/news')
  listNews() {
    return this.newsService.getAllNews();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/news/:id')
  read(@Param('id', ParserObjectIdPipe) id: string) {
    return this.newsService.getInfo(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/admin/news/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.newModel(),
    );
    return this.newsService.updateNew(image, id, updateNewsDto, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/news/:id')
  delete(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.newModel(),
    );
    return this.newsService.deleteNew(id, user);
  }
}
