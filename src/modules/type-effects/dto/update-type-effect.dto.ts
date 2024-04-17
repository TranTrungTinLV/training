import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeEffectDto } from './create-type-effect.dto';

export class UpdateTypeEffectDto extends PartialType(CreateTypeEffectDto) {}
