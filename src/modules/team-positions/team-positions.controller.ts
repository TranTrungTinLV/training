import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamPositionsService } from './team-positions.service';
import { CreateTeamPositionDto } from './dto/create-team-position.dto';
import { UpdateTeamPositionDto } from './dto/update-team-position.dto';

@Controller('team-positions')
export class TeamPositionsController {
  constructor(private readonly teamPositionsService: TeamPositionsService) {}

  @Post()
  create(@Body() body: CreateTeamPositionDto) {
    return this.teamPositionsService.createPosition(body);
  }

  @Get()
  findAll() {
    return this.teamPositionsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamPositionDto: UpdateTeamPositionDto,
  ) {
    return this.teamPositionsService.update(+id, updateTeamPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamPositionsService.remove(+id);
  }
}
