import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.usersService.read(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  update(
    @UploadedFile() avatar,
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.update(avatar, id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
