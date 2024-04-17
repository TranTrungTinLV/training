import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTeamGroupDto } from './dto/create-team-group.dto';
import { UpdateTeamGroupDto } from './dto/update-team-group.dto';
import { TeamGroupsRepository } from './team-groups.repository';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class TeamGroupsService {
  constructor(
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
    private readonly teamGroupsRepo: TeamGroupsRepository,
  ) {}
  async createTeamGroup(body: CreateTeamGroupDto) {
    const { name } = body;
    await this.teamGroupsRepo.create({ name });
    return await this.teamsService.getTeams();
  }

  findAll() {
    return this.teamGroupsRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} teamGroup`;
  }

  update(id: number, updateTeamGroupDto: UpdateTeamGroupDto) {
    return `This action updates a #${id} teamGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamGroup`;
  }
  async findAndPopulate() {
    return this.teamGroupsRepo.findAndPopulate();
  }
  async findById(id: string) {
    return this.teamGroupsRepo.findById(id);
  }
}
