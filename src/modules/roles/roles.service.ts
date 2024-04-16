import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/index';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  findOne(payload: object) {
    return this.roleRepository.findOne(payload);
  }

  findRoles() {
    return this.roleRepository.find();
  }
}
