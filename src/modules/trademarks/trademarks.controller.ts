import {
  Controller,
  Query,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  Post,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { TrademarksService } from './trademarks.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/config/index';
import { IQueryTrademark } from './interfaces/index';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { AccessTokenAuthGuard } from '../../common/guards';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/common/enum/action.enum';
import { Model } from 'mongoose';
import { Trademark, TrademarkDocument } from './schemas/trademark.schema';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class TrademarksController {
  constructor(
    private readonly trademarksService: TrademarksService,
    @InjectModel(Trademark.name)
    private readonly trademarkModel: Model<TrademarkDocument>,
  ) {}

  //* Home route
  @Get('/trademarks')
  async homeReadTradeMarks(@Res() res) {
    res.status(200).json({
      msg: 'Tải dữ liệu thành công',
      data: await this.trademarksService.getTrademark(),
    });
  }

  //* Admin route
  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/trademarks')
  async read(@Res() res) {
    res.status(200).json({
      msg: 'Tải dữ liệu thành công',
      data: await this.trademarksService.getTrademark(),
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @Patch('/admin/trademarks/logo')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadLogo(
    @UploadedFile() image: Express.Multer.File,
    @Query() query: IQueryTrademark,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.trademarkModel(),
    );
    return this.trademarksService.updateLogo(image, query, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/trademarks/license')
  @UseInterceptors(FilesInterceptor('images', 20, multerOptions))
  async create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() body: CreateLicenseDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.trademarkModel(),
    );
    return this.trademarksService.createLicense(images, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Patch('/admin/trademarks/license/:id')
  @UseInterceptors(FilesInterceptor('images', 20, multerOptions))
  async uploadLicense(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() body: UpdateLicenseDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.trademarkModel(),
    );

    return this.trademarksService.updateLicense(images, id, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/trademarks/license/:id')
  async deleteLicense(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.trademarkModel(),
    );
    return await this.trademarksService.deleteLicense(id, user);
  }
}
