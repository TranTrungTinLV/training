import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamPositionDto } from './create-team-position.dto';

export class UpdateTeamPositionDto extends PartialType(CreateTeamPositionDto) {}
