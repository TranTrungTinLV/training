import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/config/index';
import { ParserObjectIdPipe } from '../../common/pipes/index';
import { AccessTokenAuthGuard } from 'src/common/guards';
import { IQuery } from 'src/common/interfaces';
import { Response } from 'express';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../common/enum/action.enum';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { InjectModel } from '@nestjs/mongoose';
@Controller()
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
  ) {}

  //* Home route
  @Get('/teams')
  async homeReadTeams(@Query() query: IQuery, @Res() res: Response) {
    res.status(200).json({
      msg: 'Get data success',
      data: await this.teamsService.readTeams(query),
    });
  }

  //* Admin route
  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/teams')
  list() {
    return this.teamsService.getTeams();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/teams')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  create(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: CreateTeamDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.teamModel(),
    );
    return this.teamsService.createTeam(avatar, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/admin/teams/:id')
  read(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Read,
      new this.teamModel(),
    );
    return this.teamsService.getTeam(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/admin/teams/:id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  update(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id', ParserObjectIdPipe) id: string,
    @Body() body: UpdateTeamDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.teamModel(),
    );
    return this.teamsService.updateTeam(avatar, id, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/teams/:id')
  delete(
    @Param('id', ParserObjectIdPipe) id: string,
    @GetUserFromRequest() user,
  ) {
    return this.teamsService.deleteTeam(id, user);
  }
}
