import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeSlidesService } from './type-slides.service';
import { CreateTypeSlideDto } from './dto/create-type-slide.dto';
import { UpdateTypeSlideDto } from './dto/update-type-slide.dto';

@Controller('type-slides')
export class TypeSlidesController {
  constructor(private readonly typeSlidesService: TypeSlidesService) {}

  @Post()
  create(@Body() createTypeSlideDto: CreateTypeSlideDto) {
    return this.typeSlidesService.create(createTypeSlideDto);
  }

  @Get()
  findAll() {
    return this.typeSlidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeSlidesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeSlideDto: UpdateTypeSlideDto) {
    return this.typeSlidesService.update(+id, updateTypeSlideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeSlidesService.remove(+id);
  }
}
