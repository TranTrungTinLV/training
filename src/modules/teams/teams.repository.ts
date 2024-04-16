import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, QueryWithHelpers } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class TeamsRepository extends BaseRepository<TeamDocument> {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {
    super(teamModel);
  }

  async findByIdAndPopulate(id: string, path: string | string[]) {
    return this.teamModel.findById(id).populate(path);
  }

  async findAndPopulate(path: string | string[]): Promise<TeamDocument[]> {
    return this.teamModel.find().populate(path);
  }

  findQueryAndPopulate(
    path: string | string[],
    filter?: FilterQuery<TeamDocument>,
  ): QueryWithHelpers<Array<TeamDocument>, TeamDocument> {
    return this.teamModel.find(filter).populate(path);
  }
}
