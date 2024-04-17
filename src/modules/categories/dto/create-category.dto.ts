import { IsArray, IsString } from 'class-validator';
import { IsObjectId } from '../../../modules/news/decorators/is_object_id.decorator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsObjectId()
  @IsArray()
  parent: string[];
}
