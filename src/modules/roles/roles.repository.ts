import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class RoleRepository extends BaseRepository<RoleDocument> {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }
}
