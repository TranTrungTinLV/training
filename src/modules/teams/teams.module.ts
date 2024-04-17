import { Module, forwardRef } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamGroupsModule } from '../team-groups/team-groups.module';
import { TeamsRepository } from './teams.repository';
import { TeamPositionsModule } from '../team-positions/team-positions.module';
import { UsersModule } from '../users/users.module';
import { TeamGroupsService } from '../team-groups/team-groups.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    TeamPositionsModule,
    UsersModule,
    forwardRef(() => TeamGroupsModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
