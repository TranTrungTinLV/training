import { Injectable } from '@nestjs/common';
import { CreateTypeSlideDto } from './dto/create-type-slide.dto';
import { UpdateTypeSlideDto } from './dto/update-type-slide.dto';

@Injectable()
export class TypeSlidesService {
  create(createTypeSlideDto: CreateTypeSlideDto) {
    return 'This action adds a new typeSlide';
  }

  findAll() {
    return `This action returns all typeSlides`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeSlide`;
  }

  update(id: number, updateTypeSlideDto: UpdateTypeSlideDto) {
    return `This action updates a #${id} typeSlide`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeSlide`;
  }
}
