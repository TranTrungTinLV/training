import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from '../../../modules/courses/schemas/course.schema';
import { User } from '../../../modules/users/schemas/users.schemas';

export type StudentDocument = HydratedDocument<Student>;

@Schema({
  timestamps: true,
})
export class Student {
  @Prop([
    raw({
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      certificate: String,
      status: String,
      session: String,
      createdAt: Date,
    }),
  ])
  listCourse: {
    courseId: Course | Types.ObjectId;
    certificate: string;
    status: string;
    session: string;
    createdAt: Date;
  }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _uid: User;

  @Prop()
  action: string;

  filterStudent(courseId) {
    let updateCourse = [...this.listCourse];
    updateCourse = updateCourse.filter((course) => {
      return course.courseId !== courseId;
    });
    this.listCourse = updateCourse;
  }
}
export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.loadClass(Student);
