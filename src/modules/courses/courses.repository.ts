import { BaseRepository } from '../../base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesRepository extends BaseRepository<CourseDocument> {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {
    super(courseModel);
  }
}
