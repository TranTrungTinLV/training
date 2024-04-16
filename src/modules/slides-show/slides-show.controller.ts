import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SlidesShowService } from './slides-show.service';
import { CreateSlidesShowDto } from './dto/create-slides-show.dto';
import { UpdateSlidesShowDto } from './dto/update-slides-show.dto';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';
import { Action } from 'src/common/enum/action.enum';
import { InjectModel } from '@nestjs/mongoose';
import { SlideShow, SlideShowDocument } from './schemas/slides-show.schema';
import { Model } from 'mongoose';

@Controller('/admin/slides-show')
@UseGuards(AccessTokenAuthGuard)
export class SlidesShowController {
  constructor(
    private readonly slidesShowService: SlidesShowService,
    @InjectModel(SlideShow.name)
    private readonly slideShowModel: Model<SlideShowDocument>,
  ) {}

  @Get()
  list() {
    return this.slidesShowService.getAllSlidesShow();
  }

  @Post()
  create(@Body() body: CreateSlidesShowDto, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.slideShowModel(),
    );
    return this.slidesShowService.createSlideShow(body, user);
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.slidesShowService.getSlideShow(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSlidesShowDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.slideShowModel(),
    );
    return this.slidesShowService.updateSlideShow(id, body, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.slideShowModel(),
    );
    return this.slidesShowService.deleteSlideShow(id, user);
  }
}
