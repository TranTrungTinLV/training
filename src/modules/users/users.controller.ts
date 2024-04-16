import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, UpdateUserDTO } from './dto/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/config/index';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { defineAbility } from '../casl/casl-ability.factory';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../common/enum/action.enum';
import { GetUserFromRequest } from '../../common/decorators/index';
import { User, UserDocument } from './schemas/users.schemas';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  //* Home route
  @Post('/users')
  homeCreateUser(@Body() body: CreateUserDTO) {
    return this.usersService.createUser(body);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/users/:id')
  homeReadUser(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.userModel({ action: 'read-myself' }),
    );
    return this.usersService.readUser(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/users/:id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  homeUpdateUser(
    @UploadedFile() avatar,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() body: UpdateUserDTO,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.userModel({ action: 'update-myself' }),
    );
    return this.usersService.updateUser(avatar, id, body);
  }

  //* Admin route
  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/users')
  create(@Body() body: CreateUserDTO, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      User,
    );
    return this.usersService.createUser(body);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/users')
  read(@GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.userModel({ action: 'read-user' }),
    );
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/users/:id')
  delete(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      User.name,
    );
    return this.usersService.deleteUser(id, user);
  }
}
