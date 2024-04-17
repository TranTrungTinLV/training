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
import { CommonsService } from './commons.service';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';

@Controller('commons')
export class CommonsController {
  constructor(private readonly commonsService: CommonsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  createCommon(
    @UploadedFile() image,
    @Body() createCommonDto: CreateCommonDto,
  ) {
    return this.commonsService.createCommon(image, createCommonDto);
  }

  @Get()
  readCommon(@Query() query) {
    return this.commonsService.readCommon(query);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  updateCommon(
    @UploadedFile() image,
    @Param('id') id: string,
    @Body() body: UpdateCommonDto,
  ) {
    return this.commonsService.updateCommon(image, id, body);
  }

  @Delete(':title')
  deleteCommon(@Param('title') title: string) {
    return this.commonsService.deleteCommon(title);
  }
}
