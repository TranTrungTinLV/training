import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import {
  CreateUserDTO,
  CreateUserFlTeamsDTO,
  UpdateUserDTO,
} from './dto/index';
import { RolesService } from '../roles/roles.service';
import { Role } from '../../common/enum/index';
import { EmailsService } from '../emails/emails.service';
import { IFileImage } from '../../common/interfaces/index';
import {
  deleteSingleFile,
  updateSingleFile,
  isEmail,
} from '../../common/utils/index';
import { CustomErrorException } from '../../common/exception/index';
import { UserDocument } from './schemas/users.schemas';
import { FilterQuery, UpdateAggregationStage } from 'mongoose';
import { HistoriesService } from '../histories/histories.service';
import { IUpdatedUser } from './interfaces/user-updated.interface';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RolesService,
    private readonly emailsService: EmailsService,
    private readonly historiesService: HistoriesService,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userRepo.find();
  }

  async findByIdAndUpdateUser(
    id: string,
    updated: IUpdatedUser | UpdateAggregationStage,
  ): Promise<UserDocument> {
    const userUpdated = await this.userRepo.findByIdAndUpdate(id, updated, {
      new: true,
    });
    return userUpdated;
  }

  async findOneUser(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.userRepo.findOne(filter);
  }

  async createUser(body: CreateUserDTO): Promise<UserDocument> {
    const { full_name, username, password, birthday, sex, address, code } =
      body;

    const birthdayFormatted = `${birthday.year}-${birthday.month}-${birthday.day}`;

    let role = await this.roleService.findOne({ name: Role.User });
    if (!role) {
      role = await this.roleService.create({
        name: Role.User,
        permissions: ['DefaultReadUser', 'DefaultUpdateUser'],
      });
    }
    if (isEmail(username))
      await this.emailsService.verifyEmail({ code, username });

    const user = await this.userRepo.create({
      avatar: undefined,
      full_name,
      email: isEmail(username) ? username : undefined,
      username,
      password,
      role: [role._id],
      birthday: birthdayFormatted,
      sex,
      address,
    });

    return user;
  }

  async readUser(id: string): Promise<UserDocument> {
    const user = await this.userRepo.findByIdAndPopulate(id, 'role');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    file: IFileImage,
    id: string,
    body: UpdateUserDTO,
  ): Promise<UserDocument> {
    const { full_name, username, sex, address, birthday } = body;

    const userFound = await this.userRepo.findById(id);
    if (!userFound) {
      throw new NotFoundException('User not found ');
    }

    const nameAlreadyExists = await this.userRepo.findOne({
      $and: [
        { username },
        { username: { $ne: null } },
        { _id: { $ne: userFound._id } },
      ],
    });

    if (nameAlreadyExists) {
      throw new CustomErrorException('Username already exists', 422);
    }

    const payload = {
      avatar: file ? updateSingleFile(file, userFound.avatar) : undefined,
      full_name,
      username,
      sex,
      address,
      birthday: `${birthday.year}-${birthday.month}-${birthday.day + 1}`,
    };

    await this.userRepo.updateOne({ _id: id }, payload, {
      new: true,
    });

    return await this.findOneUser({ _id: userFound._id });
  }

  async deleteUser(id: string, user: IUserFromRequest): Promise<void> {
    const userFound = await this.userRepo.findById(id);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    deleteSingleFile(userFound.avatar);

    await Promise.all([
      userFound.deleteOne(),
      ,
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: 'Delete user',
      }),
    ]);
  }

  async createUserFlTeams(body: CreateUserFlTeamsDTO): Promise<UserDocument> {
    return this.userRepo.create(body);
  }
}
