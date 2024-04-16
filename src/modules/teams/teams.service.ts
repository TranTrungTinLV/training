import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTeamDto, UpdateTeamDto } from './dto/index';
import { TeamsRepository } from './teams.repository';
import { TeamGroupsService } from '../team-groups/team-groups.service';
import { ImageConstant } from '../../common/constant/index';
import { Pagination, updateSingleFile } from '../../common/utils/index';
import { TeamPositionsService } from '../team-positions/team-positions.service';
import { IFileImage, IQuery } from '../../common/interfaces/index';
import { UsersService } from '../users/users.service';
import { HistoriesService } from '../histories/histories.service';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { TeamDocument } from './schemas/team.schema';
import { TeamGroupDocument } from '../team-groups/schemas/team_group.schema';
import { TeamPositionDocument } from '../team-positions/schemas/team_position.schema';
import { IGetTeams } from './interfaces/get-teams.interface';

@Injectable()
export class TeamsService {
  constructor(
    @Inject(forwardRef(() => TeamGroupsService))
    private readonly teamGroupsService: TeamGroupsService,
    private readonly teamsRepo: TeamsRepository,
    private readonly teamPositionsService: TeamPositionsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly historiesService: HistoriesService,
  ) {}

  async readTeams(query: IQuery): Promise<TeamDocument[]> {
    const features = new Pagination(
      this.teamsRepo.findQueryAndPopulate('_uid'),
      query,
    )
      .pagination()
      .filtering()
      .sorting();
    const teams = await features.query;
    return teams;
  }

  async createTeam(
    file: IFileImage,
    body: CreateTeamDto,
    user: IUserFromRequest,
  ): Promise<IGetTeams> {
    const {
      full_name,
      email,
      phone,
      sex,
      birthday,
      academicLevel,
      position,
      experience,
      groupId,
    } = body;

    const isGroupExist = await this.teamGroupsService.findById(groupId);
    if (!isGroupExist) {
      throw new NotFoundException('GroupID not found');
    }

    const isPositionExist = await this.teamPositionsService.findById(position);
    if (!isPositionExist) {
      throw new NotFoundException('Position not found');
    }

    const newUser = await this.usersService.createUserFlTeams({
      avatar: file ? `/images/${file.filename}` : ImageConstant.team,
      full_name,
      email,
      phone,
      password: this.configService.get('SGODWEB_TEAM_PASSWORD'),
      sex,
    });

    try {
      const team = await this.teamsRepo.create({
        _uid: newUser._id,
        academicLevel,
        position,
        experience,
        listGroup: [groupId],
      });

      await Promise.all([
        this.teamsRepo.updateOne(
          { _id: groupId },
          { $push: { listMember: team._id } },
        ),
        this.historiesService.createHistory({
          _uid: user._id,
          time: new Date(),
          action: `Add new member ${full_name.first} ${full_name.last} at Teams`,
        }),
      ]);

      return await this.getTeams();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTeam(id: string): Promise<TeamDocument> {
    const teamFound = await this.teamsRepo.findByIdAndPopulate(id, [
      '_uid',
      'listGroup',
      'position',
    ]);
    if (!teamFound) {
      throw new NotFoundException('Team not found');
    }

    return teamFound;
  }

  async updateTeam(
    file: IFileImage,
    id: string,
    body: UpdateTeamDto,
    user: IUserFromRequest,
  ): Promise<IGetTeams> {
    const {
      full_name,
      email,
      phone,
      sex,
      birthday,
      academicLevel,
      experience,
    } = body;

    const team = await this.teamsRepo.findByIdAndPopulate(id, '_uid');
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const newUser = await this.usersService.findOneUser({ _id: team._uid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await newUser.updateOne({
      avatar: updateSingleFile(file, team._uid.avatar),
      full_name,
      email,
      phone,
      sex,
    });

    try {
      await Promise.all([
        this.teamsRepo.findByIdAndUpdate(id, {
          _uid: newUser._id,
          academicLevel,
          experience,
        }),
        this.historiesService.createHistory({
          _uid: user._id,
          time: new Date(),
          action: `Update a member ${full_name.first} ${full_name.last} at Teams`,
        }),
      ]);

      return await this.getTeams();
    } catch (error) {
      await newUser.deleteOne();
    }
  }

  async deleteTeam(id: string, user: IUserFromRequest): Promise<void> {
    const team = await this.teamsRepo.findById(id);
    if (!team) {
      throw new NotFoundException('Not Found');
    }
    await team.deleteOne();

    const listTeamGroup = await this.teamGroupsService.getAllTeamGroups();
    for (const e of listTeamGroup) {
      await e.updateOne({ $pull: { listTeam: { idTeam: id } } }, { new: true });
    }

    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Delete member ${user} at Teams`,
    });
  }

  async getTeams(): Promise<IGetTeams> {
    const Groups = await this.teamGroupsService.findAndPopulate([
      'listMember',
      'listMember._uid',
    ]);
    const Teams = await this.teamsRepo.findAndPopulate(['_uid', 'position']);
    const Positions = await this.teamPositionsService.getAllTeamPositions();

    return {
      groups: Groups,
      positions: Positions,
      members: Teams,
    };
  }
}
