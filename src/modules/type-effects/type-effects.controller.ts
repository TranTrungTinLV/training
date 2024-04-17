import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeEffectsService } from './type-effects.service';
import { CreateTypeEffectDto } from './dto/create-type-effect.dto';
import { UpdateTypeEffectDto } from './dto/update-type-effect.dto';

@Controller('type-effects')
export class TypeEffectsController {
  constructor(private readonly typeEffectsService: TypeEffectsService) {}

  @Post()
  create(@Body() createTypeEffectDto: CreateTypeEffectDto) {
    return this.typeEffectsService.create(createTypeEffectDto);
  }

  @Get()
  findAll() {
    return this.typeEffectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeEffectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeEffectDto: UpdateTypeEffectDto) {
    return this.typeEffectsService.update(+id, updateTypeEffectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeEffectsService.remove(+id);
  }
}
