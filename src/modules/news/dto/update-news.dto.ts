import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './index';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
