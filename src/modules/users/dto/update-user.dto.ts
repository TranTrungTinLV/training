import { Transform } from 'class-transformer';
import { IsValidAge } from '../../../common/decorators/index';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Sex } from '../../../common/enum';
import { Status } from '../schemas/enum/status.enum';

export class UpdateUserDTO {
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  full_name: { last: string; first: string };

  @IsOptional()
  @IsEnum(Sex)
  sex: Sex;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsValidAge()
  @IsObject()
  birthday: { day: number; month: number; year: number };

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsEnum(Status)
  status: string;

  @IsOptional()
  @IsDate()
  loggerAt: Date;
}
