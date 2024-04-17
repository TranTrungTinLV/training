import { PickType } from '@nestjs/mapped-types';
import { Transform, Type, plainToClass } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Sex } from '../../../common/enum';
import { IsGreaterThanFive } from '../../../common/decorators/is_valid_age.decorator';

class FullName {
  @IsString()
  @IsNotEmpty()
  last: string;

  @IsString()
  @IsNotEmpty()
  first: string;
}

class Birthday {
  day: number;
  month: number;
  year: number;
}

export class CreateTeamDto {
  @Transform((params) => params.value.trim())
  @Transform((params) => params.value.toLowerCase())
  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @IsNotEmpty()
  academicLevel: string;

  @IsString()
  position: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  groupId: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  full_name: { last: string; first: string };

  @IsEnum(Sex)
  sex: Sex;

  @Transform(({ value }) => JSON.parse(value))
  @IsGreaterThanFive()
  birthday: { day: number; month: number; year: number };
}
