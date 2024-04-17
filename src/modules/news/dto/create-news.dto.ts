import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { modeNewsEnum } from '../../../common/enum';
import { IsObjectId } from '../decorators/is_object_id.decorator';
import { IsTimeValid } from '../decorators/is_time_valid_decorator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsEnum(modeNewsEnum)
  mode: string;

  @IsOptional()
  tags: string;

  @IsObjectId()
  categories: string;

  @IsTimeValid('mode')
  time_public: Date;
}
