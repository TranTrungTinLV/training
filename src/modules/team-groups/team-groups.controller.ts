import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamGroupsService } from './team-groups.service';
import { CreateTeamGroupDto } from './dto/create-team-group.dto';
import { UpdateTeamGroupDto } from './dto/update-team-group.dto';

@Controller('team-groups')
export class TeamGroupsController {
  constructor(private readonly teamGroupsService: TeamGroupsService) {}

  @Post()
  create(@Body() createTeamGroupDto: CreateTeamGroupDto) {
    return this.teamGroupsService.createTeamGroup(createTeamGroupDto);
  }

  @Get()
  findAll() {
    return this.teamGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamGroupDto: UpdateTeamGroupDto,
  ) {
    return this.teamGroupsService.update(+id, updateTeamGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamGroupsService.remove(+id);
  }
}
