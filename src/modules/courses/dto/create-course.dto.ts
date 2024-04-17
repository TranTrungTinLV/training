import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { levelCourseEnum } from '../../../common/enum';

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
  description: string;

  @IsOptional()
  timeOpening: Date;

  @IsOptional()
  timeExpire: Date;

  @IsOptional()
  price: number;

  @IsNotEmpty()
  maxQuantity: number;

  @IsNotEmpty()
  reducePrice: number;
}
