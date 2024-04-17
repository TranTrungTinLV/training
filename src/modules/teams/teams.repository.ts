import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class TeamsRepository extends BaseRepository<TeamDocument> {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {
    super(teamModel);
  }

  async findByIdAndPopulate(id: string) {
    return this.teamModel
      .findById(id)
      .populate('_uid')
      .populate('position')
      .populate('listGroup');
  }
  async findAndPopulate() {
    return this.teamModel.find().populate('_uid').populate('position');
  }

  async _findByIdAndPopulate(id: string) {
    return this.teamModel.findById(id).populate('_uid');
  }
}
