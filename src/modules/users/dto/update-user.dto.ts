import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { Transform } from 'class-transformer';
import { IsGreaterThanFive } from '../../../common/decorators/is_valid_age.decorator';
import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Sex } from '../../../common/enum';

export class UpdateUserDTO {
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  full_name: { last: string; first: string };

  @IsEnum(Sex)
  sex: Sex;

  @Transform(({ value }) => JSON.parse(value))
  @IsGreaterThanFive()
  @IsObject()
  birthday: { day: number; month: number; year: number };

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
