import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Put,
  Res,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Response } from 'express';
import { ILocationParams } from './interfaces/location_params.interface';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post(':children')
  create(@Param('children') children: string, @Body() body: CreateLocationDto) {
    return this.locationsService.createLocation(children, body);
  }

  @Put(':children/:id')
  update(@Param() params: ILocationParams, @Body() body: UpdateLocationDto) {
    return this.locationsService.updateLocation(params, body);
  }

  @Delete(':children/:id')
  async delete(@Param() params: ILocationParams) {
    return this.locationsService.deleteLocation(params);
  }
}
