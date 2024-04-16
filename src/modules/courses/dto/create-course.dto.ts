import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { levelCourseEnum } from '../schemas/enum/course.enum';
import { Transform } from 'class-transformer';
import { IsValidTimeCourse } from '../decorators/is_valid_time_course.decorator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(levelCourseEnum)
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  teacher: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  timeOpening: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsValidTimeCourse('timeOpening', {
    message: 'Time expire must be greater than Time opening',
  })
  timeExpire: Date;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  maxQuantity: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  reducePrice: number;
}
