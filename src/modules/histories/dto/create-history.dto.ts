import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from '../../../modules/news/decorators';

export class CreateHistoryDto {
  @IsObjectId()
  _uid: string;

  @IsDate()
  time: Date;

  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  object?: Object;
}
