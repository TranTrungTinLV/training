import { Injectable } from '@nestjs/common';
import { CreateTypeEffectDto } from './dto/create-type-effect.dto';
import { UpdateTypeEffectDto } from './dto/update-type-effect.dto';

@Injectable()
export class TypeEffectsService {
  create(createTypeEffectDto: CreateTypeEffectDto) {
    return 'This action adds a new typeEffect';
  }

  findAll() {
    return `This action returns all typeEffects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeEffect`;
  }

  update(id: number, updateTypeEffectDto: UpdateTypeEffectDto) {
    return `This action updates a #${id} typeEffect`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeEffect`;
  }
}
