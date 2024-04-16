import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/config';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ParserObjectIdPipe } from 'src/common/pipes';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { GetUserFromRequest } from '../../common/decorators';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { Slide, SlideDocument } from './schemas/slide.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action } from '../../common/enum/action.enum';

@Controller()
export class SlidesController {
  constructor(
    private readonly slidesService: SlidesService,
    @InjectModel(Slide.name) private readonly slideModel: Model<SlideDocument>,
  ) {}

  //* Home route
  @Get('sliders')
  homeListSlides() {
    return this.slidesService.getSliders();
  }

  //* Admin route

  @Get('/admin/slides')
  list() {
    return this.slidesService.getAllSlides();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/slides')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() image,
    @Body() body: CreateSlideDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.slideModel(),
    );
    return this.slidesService.createSlide(image, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/slides/:id')
  read(@Param('id') id: string) {
    return this.slidesService.readSlide(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/admin/slides/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image,
    @Body() body: UpdateSlideDto,
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.slideModel(),
    );
    return this.slidesService.updateSlide(image, id, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/slides/:id')
  delete(@Param('id') id: string, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.slideModel(),
    );
    return this.slidesService.deleteSlide(id, user);
  }
}
