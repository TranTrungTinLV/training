import { Module, forwardRef } from '@nestjs/common';
import { TeamGroupsService } from './team-groups.service';
import { TeamGroupsController } from './team-groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamGroup, TeamGroupSchema } from './schemas/team_group.schema';
import { TeamGroupsRepository } from './team-groups.repository';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamGroup.name, schema: TeamGroupSchema },
    ]),
    forwardRef(() => TeamsModule),
  ],
  controllers: [TeamGroupsController],
  providers: [TeamGroupsService, TeamGroupsRepository],
  exports: [TeamGroupsService],
})
export class TeamGroupsModule {}
