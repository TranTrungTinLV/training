import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './index';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
