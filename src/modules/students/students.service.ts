import { Injectable } from '@nestjs/common';
import { StudentsRepository } from './students.repository';
import { Types } from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepo: StudentsRepository) {}

  async getAllStudents() {
    return this.studentsRepo.find();
  }

  async filterCourse(courseId: Types.ObjectId) {
    const students = await this.getAllStudents();

    for (const student of students) {
      let updateCourse = [...student.listCourse];
      updateCourse = updateCourse.filter((value) => {
        return value.courseId !== courseId;
      });
    }
  }
}
