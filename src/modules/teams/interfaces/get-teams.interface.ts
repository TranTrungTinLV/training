import { TeamGroupDocument } from 'src/modules/team-groups/schemas/team_group.schema';
import { TeamPositionDocument } from 'src/modules/team-positions/schemas/team_position.schema';
import { TeamDocument } from '../schemas/team.schema';

export interface IGetTeams {
  groups: TeamGroupDocument[];
  positions: TeamPositionDocument[];
  members: TeamDocument[];
}
