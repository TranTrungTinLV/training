import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from '../../../modules/news/decorators/index';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObjectId()
  @IsArray()
  parent: string[];
}
