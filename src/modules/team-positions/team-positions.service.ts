import { Injectable } from '@nestjs/common';
import { CreateTeamPositionDto } from './dto/create-team-position.dto';
import { UpdateTeamPositionDto } from './dto/update-team-position.dto';
import { TeamPositionsRepository } from './team-positions.repository';

@Injectable()
export class TeamPositionsService {
  constructor(private readonly teamPositionRepo: TeamPositionsRepository) {}
  async createPosition(body: CreateTeamPositionDto) {
    const { name } = body;
    await this.teamPositionRepo.create({ name });
    const positions = await this.teamPositionRepo.find();
    return positions;
  }

  async findAll() {
    return this.teamPositionRepo.find();
  }

  update(id: number, updateTeamPositionDto: UpdateTeamPositionDto) {
    return `This action updates a #${id} teamPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamPosition`;
  }
  async findById(id: string) {
    return this.teamPositionRepo.findById(id);
  }
}
