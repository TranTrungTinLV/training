import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeSlidesService } from './type-slides.service';

@Controller('type-slides')
export class TypeSlidesController {
  constructor(private readonly typeSlidesService: TypeSlidesService) {}
}
