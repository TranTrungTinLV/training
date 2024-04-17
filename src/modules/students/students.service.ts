import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsRepository } from './students.repository';
import { Types } from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepo: StudentsRepository) {}
  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return this.studentsRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async filterCourse(courseId: Types.ObjectId) {
    const students = await this.findAll();
    for (const student of students) {
      let updateCourse = [...student.listCourse];
      updateCourse = updateCourse.filter((value) => {
        return value.courseId !== courseId;
      });
    }
  }
}
