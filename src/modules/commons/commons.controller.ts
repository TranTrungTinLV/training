import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonsService } from './commons.service';
import { CreateCommonDto, UpdateCommonDto } from './dto/index';
import { multerOptions } from '../../common/config/index';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { IQuery } from 'src/common/interfaces';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { Action } from 'src/common/enum/action.enum';
import { GetUserFromRequest } from 'src/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Common, CommonDocument } from './schemas/common.schema';
import { Model } from 'mongoose';

@Controller()
export class CommonsController {
  constructor(
    private readonly commonsService: CommonsService,
    @InjectModel(Common.name)
    private readonly locationModel: Model<CommonDocument>,
  ) {}

  //* Home route
  @Get('/commons')
  homeReadCommon() {
    return this.commonsService.readCommon();
  }

  //* Admin route
  @Get('/admin/commons')
  read(@Query() query: IQuery, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.locationModel(),
    );
    return this.commonsService.readCommon(query);
  }

  @Post('/admin/commons')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() image,
    @Body() createCommonDto: CreateCommonDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.locationModel(),
    );
    return this.commonsService.createCommon(image, createCommonDto, user);
  }

  @Put('/admin/commons/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() body: UpdateCommonDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.locationModel(),
    );
    return this.commonsService.updateCommon(image, id, body, user);
  }

  @Delete('/admin/commons:title')
  delete(@Param('title') title: string, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.locationModel(),
    );
    return this.commonsService.deleteCommon(title, user);
  }
}
