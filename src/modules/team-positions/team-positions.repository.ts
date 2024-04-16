import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  TeamPosition,
  TeamPositionDocument,
} from './schemas/team_position.schema';

@Injectable()
export class TeamPositionsRepository extends BaseRepository<TeamPositionDocument> {
  constructor(
    @InjectModel(TeamPosition.name)
    private readonly teamPositionModel: Model<TeamPositionDocument>,
  ) {
    super(teamPositionModel);
  }
}
