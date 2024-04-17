import {
  Controller,
  Query,
  Get,
  Delete,
  Patch,
  Res,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TrademarksService } from './trademarks.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';
import { IQuery } from './interfaces/query.interface';

@Controller('trademarks')
export class TrademarksController {
  constructor(private readonly trademarksService: TrademarksService) {}

  @Get()
  async read() {
    return this.trademarksService.findOneTrademark();
  }

  @Patch('/logo')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  uploadLogo(
    @UploadedFile() image: Express.Multer.File,
    @Query() query: IQuery,
  ) {
    return this.trademarksService.updateLogo(image, query);
  }

  @Patch('/license/:id')
  @UseInterceptors(FilesInterceptor('images', 20, multerOptions))
  uploadLicense(
    @UploadedFile() images: Array<Express.Multer.File>,
    @Param('id') id: string,
    @Body() body,
  ) {
    return this.trademarksService.updateLicense(images, id, body);
  }

  @Delete('/license/:id')
  async deleteLicense(@Param('id') id: string) {
    return await this.trademarksService.deleteLicense(id);
  }
}
