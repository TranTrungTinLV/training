import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../../common/enum/index';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserFlTeamsDTO } from './dto/create-user-fl-teams.dto';
import { isEmail } from '../../common/utils';
import { EmailsService } from '../emails/emails.service';
import { IFileImage } from '../../common/interfaces/file.interface';
import {
  deleteSingleFile,
  updateSingleFile,
} from '../../common/utils/transfer.util';
import { Types } from 'mongoose';
import { CustomErrorException } from '../emails/exception/custom-error.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RolesService,
    private readonly emailsService: EmailsService,
  ) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findOneUser(filter) {
    return this.userRepo.findOne(filter);
  }

  async findByIdAndUpdate(id, updated) {
    return this.userRepo.findByIdAndUpdate(id, updated, { new: true });
  }

  async create(body: CreateUserDTO) {
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
    if (isEmail(username)) {
      await this.emailsService.verifyEmail({ code, username });
    }
    const user = await this.userRepo.create({
      avatar: undefined,
      full_name: full_name,
      email: undefined,
      phone: undefined,
      username: username,
      password: password,
      role: role ? role : [role._id],
      birthday: birthdayFormatted,
      sex: sex,
      address: address,
    });
    return user;
  }

  async read(id: string) {
    const user = (await this.userRepo.findById(id)).populate('role');
    if (!user) {
      throw new NotFoundException('Not Found User');
    }
    return user;
  }

  async update(file: IFileImage, id: string, body: UpdateUserDTO) {
    const { full_name, username, sex, address, birthday } = body;
    const userFound = await this.userRepo.findById(id);
    if (!userFound) {
      throw new NotFoundException('Not Found User');
    }
    const isUniqueUsername = await this.isUniqueUsername(
      username,
      userFound._id,
    );
    if (isUniqueUsername) {
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

  async delete(id: string) {
    const userFound = await this.userRepo.findById(id);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    // userFound.deleteOne();
    const result = deleteSingleFile(userFound.avatar);

    return this.findAll();
  }

  async createUserFlTeams(body) {
    return this.userRepo.create(body);
  }
  async isUniqueUsername(username: string, id: Types.ObjectId) {
    const result = await this.userRepo.findOne({
      $and: [
        { username },
        { username: { $ne: null } },
        { _id: { $ne: id.toString() } },
      ],
    });
    return result;
  }
}
