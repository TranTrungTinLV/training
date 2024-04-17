import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TeamGroup, TeamGroupDocument } from './schemas/team_group.schema';
import { Team } from '../teams/schemas/team.schema';

@Injectable()
export class TeamGroupsRepository extends BaseRepository<TeamGroupDocument> {
  constructor(
    @InjectModel(TeamGroup.name)
    private readonly teamGroupModel: Model<TeamGroupDocument>,
  ) {
    super(teamGroupModel);
  }
  async findAndPopulate() {
    return this.teamGroupModel
      .find()
      .populate('listMember')
      .populate('listMember._uid');
  }
}
