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
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/config/index';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { IQuery } from 'src/common/interfaces';
import { Response } from 'express';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { Action } from 'src/common/enum/action.enum';
import { GetUserFromRequest } from 'src/common/decorators';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Controller()
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  //* Home route
  @Get('/courses')
  homeReadCourses(@Query() query: IQuery, @Res() res: Response) {
    return this.coursesService.readCourses(query);
  }

  @Get('/courses/:id')
  async homeReadCourse(@Param('id') id: string, @Res() res: Response) {
    res.status(200).json({
      msg: 'Get course data success',
      data: await this.coursesService.readCourse(id),
    });
  }
  //* Admin route
  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/courses')
  list() {
    return this.coursesService.listCourses();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/courses')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() image,
    @Body() body: CreateCourseDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.courseModel(),
    );
    return this.coursesService.createCourse(image, body);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/courses/:id')
  read(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.courseModel(),
    );
    return this.coursesService.readCourse(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/admin/courses/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() body: UpdateCourseDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.courseModel(),
    );
    return this.coursesService.updateCourse(image, id, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/courses/:id')
  delete(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.courseModel(),
    );
    return this.coursesService.deleteCourse(id, user);
  }
}
