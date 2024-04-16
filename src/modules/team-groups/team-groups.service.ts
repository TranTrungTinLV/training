import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTeamGroupDto } from './dto/create-team-group.dto';
import { TeamGroupsRepository } from './team-groups.repository';
import { TeamsService } from '../teams/teams.service';
import { TeamGroupDocument } from './schemas/team_group.schema';
import { IGetTeams } from '../teams/interfaces/get-teams.interface';

@Injectable()
export class TeamGroupsService {
  constructor(
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
    private readonly teamGroupsRepo: TeamGroupsRepository,
  ) {}

  async createTeamGroup(body: CreateTeamGroupDto): Promise<IGetTeams> {
    const { name } = body;

    await this.teamGroupsRepo.create({ name });

    return await this.teamsService.getTeams();
  }

  async getAllTeamGroups(): Promise<TeamGroupDocument[]> {
    return this.teamGroupsRepo.find();
  }

  async findAndPopulate(path: string | string[]): Promise<TeamGroupDocument[]> {
    return this.teamGroupsRepo.findAndPopulate(path);
  }
  async findById(id: string): Promise<TeamGroupDocument> {
    return this.teamGroupsRepo.findById(id);
  }
}
