import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './index';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
