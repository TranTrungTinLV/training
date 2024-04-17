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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@UploadedFile() image, @Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(image, body);
  }

  @Get()
  read() {
    return this.coursesService.listCourses();
  }

  @Get(':id')
  GetCourse(@Param('id') id: string) {
    return this.coursesService.findByIdCourse(id);
  }
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @UploadedFile() image,
    @Param('id') id: string,
    @Body() body: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(image, id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
