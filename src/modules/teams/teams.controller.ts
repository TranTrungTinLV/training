import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  list() {
    return this.teamsService.findAllTeams();
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  create(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: CreateTeamDto,
  ) {
    return this.teamsService.createTeam(avatar, body);
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.teamsService.findOneTeam(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  update(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(avatar, id, updateTeamDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }
}
