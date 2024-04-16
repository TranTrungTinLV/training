import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonDto } from './index';

export class UpdateCommonDto extends PartialType(CreateCommonDto) {}
