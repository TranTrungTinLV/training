import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}
  async create(payload: object): Promise<RoleDocument> {
    const role = await this.roleModel.create(payload);
    return await role.save();
  }
  async findOne(
    filter: FilterQuery<RoleDocument>,
    options?: QueryOptions,
  ): Promise<RoleDocument> {
    return await this.roleModel.findOne(filter, options);
  }
}
