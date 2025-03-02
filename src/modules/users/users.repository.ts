import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
  async findByIdAndPopulate(
    id: string,
    path: string | string[],
  ): Promise<UserDocument> {
    return this.userModel.findById(id).populate(path);
  }
}
