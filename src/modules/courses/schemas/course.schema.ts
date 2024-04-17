import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from '../../../modules/students/schemas/student.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  timeOpening: Date;

  @Prop()
  timeExpire: Date;

  @Prop()
  price: number;

  @Prop()
  maxQuantity: number;

  @Prop([raw({ name: String, schedule: String, timeBeginLesson: Date })])
  listLesson: { name: string; schedule: string; timeBeginLesson: Date }[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] })
  listUser: Student[];

  @Prop([String])
  willLearn: string[];

  @Prop([
    raw({
      chapter: String,
      chapterContent: [{ lesson: String, numberOfLesson: Number }],
    }),
  ])
  studyRoute: {
    chapter: string;
    chapterContent: { lesson: string; numberOfLesson: number }[];
  }[];

  @Prop()
  reducePrice: number;

  @Prop()
  teacher: string;

  @Prop()
  slug: string;

  @Prop()
  image: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
