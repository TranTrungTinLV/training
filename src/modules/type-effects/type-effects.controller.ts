import { Controller } from '@nestjs/common';
import { TypeEffectsService } from './type-effects.service';

@Controller('type-effects')
export class TypeEffectsController {
  constructor(private readonly typeEffectsService: TypeEffectsService) {}
}
