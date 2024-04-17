import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeSlideDto } from './create-type-slide.dto';

export class UpdateTypeSlideDto extends PartialType(CreateTypeSlideDto) {}
