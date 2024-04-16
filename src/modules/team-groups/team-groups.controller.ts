import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TeamGroupsService } from './team-groups.service';
import { CreateTeamGroupDto } from './dto/create-team-group.dto';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';
import { Action } from 'src/common/enum/action.enum';
import { InjectModel } from '@nestjs/mongoose';
import { TeamGroup, TeamGroupDocument } from './schemas/team_group.schema';
import { Model } from 'mongoose';

@UseGuards(AccessTokenAuthGuard)
@Controller('/admin/team-groups')
export class TeamGroupsController {
  constructor(
    private readonly teamGroupsService: TeamGroupsService,
    @InjectModel(TeamGroup.name)
    private readonly teamGroupModel: Model<TeamGroupDocument>,
  ) {}

  @Post()
  create(
    @Body() createTeamGroupDto: CreateTeamGroupDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.teamGroupModel(),
    );
    return this.teamGroupsService.createTeamGroup(createTeamGroupDto);
  }

  @Get()
  list() {
    return this.teamGroupsService.getAllTeamGroups();
  }
}
