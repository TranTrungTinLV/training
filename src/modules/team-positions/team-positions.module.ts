import { Module } from '@nestjs/common';
import { TeamPositionsService } from './team-positions.service';
import { TeamPositionsController } from './team-positions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamPositionSchema } from './schemas/team_position.schema';
import { TeamPositionsRepository } from './team-positions.repository';
import { TeamPosition } from './schemas/team_position.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamPosition.name, schema: TeamPositionSchema },
    ]),
  ],
  controllers: [TeamPositionsController],
  providers: [TeamPositionsService, TeamPositionsRepository],
  exports: [TeamPositionsService],
})
export class TeamPositionsModule {}
