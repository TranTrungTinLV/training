import { Injectable } from '@nestjs/common';
import { CreateTeamPositionDto } from './dto/index';
import { TeamPositionsRepository } from './team-positions.repository';
import { TeamPositionDocument } from './schemas/team_position.schema';

@Injectable()
export class TeamPositionsService {
  constructor(private readonly teamPositionRepo: TeamPositionsRepository) {}
  async createPosition(
    body: CreateTeamPositionDto,
  ): Promise<TeamPositionDocument[]> {
    const { name } = body;

    await this.teamPositionRepo.create({ name });
    const positions = await this.getAllTeamPositions();

    return positions;
  }

  async getAllTeamPositions(): Promise<TeamPositionDocument[]> {
    return this.teamPositionRepo.find();
  }

  async findById(id: string): Promise<TeamPositionDocument> {
    return this.teamPositionRepo.findById(id);
  }
}
