import { PartialType } from '@nestjs/mapped-types';
import { CreateSlidesShowDto } from './create-slides-show.dto';

export class UpdateSlidesShowDto extends PartialType(CreateSlidesShowDto) {}
