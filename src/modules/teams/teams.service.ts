import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsRepository } from './teams.repository';
import { TeamGroupsService } from '../team-groups/team-groups.service';
import { ImageConstant } from '../../common/constant/image.constant';
import {
  deleteSingleFile,
  updateSingleFile,
} from '../../common/utils/transfer.util';
import { TeamPositionsService } from '../team-positions/team-positions.service';
import { IFileImage } from '../../common/interfaces/file.interface';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/users.schemas';

@Injectable()
export class TeamsService {
  constructor(
    @Inject(forwardRef(() => TeamGroupsService))
    private readonly teamGroupsService: TeamGroupsService,
    private readonly teamsRepo: TeamsRepository,
    private readonly teamPositionsService: TeamPositionsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  async createTeam(file: IFileImage, body: CreateTeamDto) {
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
    let imagePath;

    const isGroupPresent = await this.teamGroupsService.findById(groupId);
    if (!isGroupPresent) {
      throw new NotFoundException('Not Found GroupID');
    }
    const isPositionPresent = await this.teamPositionsService.findById(
      position,
    );
    if (!isPositionPresent) {
      throw new NotFoundException('Not Found Position');
    }

    file
      ? (imagePath = `/images/${file.filename}`)
      : (imagePath = ImageConstant.team);

    const user = await this.usersService.createUserFlTeams({
      avatar: imagePath,
      full_name,
      email,
      phone,
      password: this.configService.get('SGODWEB_TEAM_PASSWORD'),
      sex,
    });
    try {
      const team = await this.teamsRepo.create({
        _uid: user._id,
        academicLevel,
        position,
        experience,
        listGroup: [groupId],
      });
      await this.teamsRepo.updateOne(
        { _id: groupId },
        { $push: { listMember: team._id } },
      );
      await this.getTeams();
    } catch (error) {
      throw new Error(error.message);
    }
    return this.getTeams();
  }

  async findAllTeams() {
    return await this.getTeams();
  }

  async findOneTeam(id: string) {
    const team = await this.teamsRepo.findByIdAndPopulate(id);
    if (!team) {
      throw new NotFoundException('Not Found Team!');
    }
    return team;
  }

  async updateTeam(file: IFileImage, id: string, body: UpdateTeamDto) {
    const {
      full_name,
      email,
      phone,
      sex,
      birthday,
      academicLevel,
      experience,
    } = body;
    const team = await this.teamsRepo._findByIdAndPopulate(id);
    if (!team) {
      throw new NotFoundException('Not Found Team');
    }

    const user = await this.usersService.findOneUser({ _id: team._uid });
    if (!user) {
      throw new NotFoundException('Not Found User');
    }
    await user.updateOne({
      avatar: updateSingleFile(file, team._uid.avatar),
      full_name,
      email,
      phone,
      sex,
    });
    try {
      await this.teamsRepo.findByIdAndUpdate(id, {
        _uid: user._id,
        academicLevel,
        experience,
      });

      return await this.getTeams();
    } catch (error) {
      // ** rollback when create team fail
      await user.deleteOne();
    }
  }

  async deleteTeam(id: string) {
    const team = await this.teamsRepo.findById(id);
    if (!team) {
      throw new NotFoundException('Not Found');
    }
    await team.deleteOne();

    // ** delete this team in team group
    const listTeamGroup = await this.teamGroupsService.findAll();
    for (const e of listTeamGroup) {
      await e.updateOne({ $pull: { listTeam: { idTeam: id } } }, { new: true });
    }

    // ** exec delete image file
    // if (team.image !== ImageConstant.team) {
    //   deleteSingleFile(team.image);
    // }
    return await this.getTeams();
  }

  async getTeams() {
    const Groups = await this.teamGroupsService.findAndPopulate();
    const Teams = await this.teamsRepo.findAndPopulate();
    const Positions = await this.teamPositionsService.findAll();
    const data = {
      groups: Groups,
      positions: Positions,
      members: Teams,
    };
    return data;
  }
}
