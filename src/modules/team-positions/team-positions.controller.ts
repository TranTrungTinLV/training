import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamPositionsService } from './team-positions.service';
import { CreateTeamPositionDto } from './dto/create-team-position.dto';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { GetUserFromRequest } from 'src/common/decorators';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from '../casl/casl-ability.factory';
import { Action } from 'src/common/enum/action.enum';
import { InjectModel } from '@nestjs/mongoose';
import {
  TeamPosition,
  TeamPositionDocument,
} from './schemas/team_position.schema';
import { Model } from 'mongoose';

@UseGuards(AccessTokenAuthGuard)
@Controller('/admin/team-positions')
export class TeamPositionsController {
  constructor(
    private readonly teamPositionsService: TeamPositionsService,
    @InjectModel(TeamPosition.name)
    private readonly teamPosition: Model<TeamPositionDocument>,
  ) {}

  @Post()
  create(@Body() body: CreateTeamPositionDto, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.teamPosition(),
    );
    return this.teamPositionsService.createPosition(body);
  }

  @Get()
  list() {
    return this.teamPositionsService.getAllTeamPositions();
  }
}
