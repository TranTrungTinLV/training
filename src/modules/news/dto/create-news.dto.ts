import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { IsObjectId, IsTimeValid } from '../decorators/index';
import { modeNewsEnum } from '../schemas/enum/mode_news.enum';

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
