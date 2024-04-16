import { Module } from '@nestjs/common';
import { TypeEffectsService } from './type-effects.service';
import { TypeEffectsController } from './type-effects.controller';

@Module({
  controllers: [TypeEffectsController],
  providers: [TypeEffectsService],
})
export class TypeEffectsModule {}
