import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamGroupDto } from './create-team-group.dto';

export class UpdateTeamGroupDto extends PartialType(CreateTeamGroupDto) {}
