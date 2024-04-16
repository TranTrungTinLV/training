import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './dto/index';
import { CoursesRepository } from './courses.repository';
import { ImageConstant } from '../../common/constant/index';
import {
  formatSlug,
  deleteSingleFile,
  updateSingleFile,
  isObjectId,
  Pagination,
} from '../../common/utils/index';
import { StudentsService } from '../students/students.service';
import { IFileImage, IQuery } from '../../common/interfaces/index';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';
import { CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepo: CoursesRepository,
    private readonly studentsService: StudentsService,
    private readonly historiesService: HistoriesService,
  ) {}

  async readCourses(query: IQuery) {
    const features = new Pagination(this.coursesRepo.findQuery(), query)
      .pagination()
      .sorting()
      .filtering()
      .searching();

    const courses = await features.query;
    const numbersCourse = await this.coursesRepo.countDocuments();

    return { data: courses, numbersCourse };
  }

  async listCourses(): Promise<CourseDocument[]> {
    return this.coursesRepo.find();
  }

  async readCourse(id: string): Promise<CourseDocument> {
    const course = isObjectId(id)
      ? await this.coursesRepo.findById(id)
      : await this.coursesRepo.findOne({ slug: id });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async createCourse(
    file: IFileImage,
    body: CreateCourseDto,
  ): Promise<CourseDocument[]> {
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

  async updateCourse(
    file: IFileImage,
    id: string,
    body: UpdateCourseDto,
    user: IUserFromRequest,
  ): Promise<CourseDocument> {
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
      throw new NotFoundException('Course not found');
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
    await Promise.all([
      courseFound.updateOne(newCourseData, { new: true }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update info course successfully`,
      }),
    ]);

    return this.findByIdCourse(courseFound._id.toString());
  }

  async deleteCourse(id: string, user: IUserFromRequest): Promise<void> {
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

    await Promise.all([
      this.studentsService.filterCourse(courseFound._id),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete course ${courseFound.name} successfully`,
      }),
    ]);
  }

  async findByIdCourse(id: string): Promise<CourseDocument> {
    return this.coursesRepo.findById(id);
  }
}
