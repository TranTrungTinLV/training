import { Module } from '@nestjs/common';
import { TypeSlidesService } from './type-slides.service';
import { TypeSlidesController } from './type-slides.controller';

@Module({
  controllers: [TypeSlidesController],
  providers: [TypeSlidesService],
})
export class TypeSlidesModule {}
