import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from './courses.repository';
import { ImageConstant } from '../../common/constant/image.constant';
import { formatSlug } from '../../common/utils';
import {
  deleteSingleFile,
  updateSingleFile,
} from '../../common/utils/transfer.util';
import { StudentsService } from '../students/students.service';
import { IFileImage } from '../../common/interfaces/file.interface';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepo: CoursesRepository,
    private readonly studentsService: StudentsService,
  ) {}
  listCourses() {
    return this.coursesRepo.find();
  }
  async createCourse(file: IFileImage, body: CreateCourseDto) {
    const {
      name,
      description,
      teacher,
      level,
      price,
      timeOpening,
      timeExpire,
      maxQuantity,
      reducePrice,
    } = body;
    const coursePresent = await this.coursesRepo.findOne({
      name,
      timeOpening,
      timeExpire,
      level,
    });
    if (coursePresent) {
      throw new BadRequestException('Course already exists');
    }
    await this.coursesRepo.create({
      name,
      description,
      teacher,
      level,
      price,
      timeOpening,
      timeExpire,
      maxQuantity,
      reducePrice,
      image: file ? `images/${file.path}` : ImageConstant.course,
      slug: formatSlug(name, { isEdit: false }),
    });
    return this.listCourses();
  }

  async updateCourse(file: IFileImage, id: string, body: UpdateCourseDto) {
    const {
      name,
      description,
      teacher,
      level,
      price,
      timeOpening,
      timeExpire,
      maxQuantity,
      reducePrice,
    } = body;

    const courseFound = await this.findByIdCourse(id);
    if (!courseFound) {
      throw new NotFoundException('Not Found Course');
    }
    const newCourseData = {
      name,
      description,
      teacher,
      level,
      price,
      timeOpening,
      timeExpire,
      maxQuantity,
      reducePrice,
      image: updateSingleFile(file, courseFound.image),
      slug: formatSlug(name, { isEdit: true, oldSlug: courseFound.slug }),
    };
    await courseFound.updateOne(newCourseData, { new: true });
    return this.findByIdCourse(courseFound._id.toString());
  }

  async deleteCourse(id: string) {
    const courseFound = await this.findByIdCourse(id);
    if (!courseFound) {
      throw new BadRequestException('Invalid param');
    }
    if (courseFound.listUser.length > 0) {
      throw new BadRequestException(
        'The course is currently being studied, cannot be deleted',
      );
    }
    courseFound.deleteOne();
    deleteSingleFile(courseFound.image);

    await this.studentsService.filterCourse(courseFound._id);

    return this.listCourses();
  }

  findByIdCourse(id: string) {
    return this.coursesRepo.findById(id);
  }
}
