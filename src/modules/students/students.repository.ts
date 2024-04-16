import { Injectable } from '@nestjs/common';
import { Student, StudentDocument } from './schemas/student.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class StudentsRepository extends BaseRepository<StudentDocument> {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {
    super(studentModel);
  }
}
