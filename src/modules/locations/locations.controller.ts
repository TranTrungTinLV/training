import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/index';
import { ILocationParams } from './interfaces/location_params.interface';
import { AccessTokenAuthGuard } from '../../common/guards';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/common/enum/action.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import { Model } from 'mongoose';
import { defineAbility } from '../casl/casl-ability.factory';
import { GetUserFromRequest } from 'src/common/decorators';

@Controller()
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  //* Home Route
  @Get('locations')
  async read(@Res() res) {
    res.status(200).json({
      msg: ' Tải dữ liệu thành công ',
      data: await this.locationsService.getLocation(),
    });
  }

  //* Admin Route
  @UseGuards(AccessTokenAuthGuard)
  @Post('/admin/locations/:children')
  create(
    @Param('children') children: string,
    @Body() body: CreateLocationDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Create,
      new this.locationModel(),
    );
    return this.locationsService.createLocation(children, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Put('/admin/locations/:children/:id')
  update(
    @Param() params: ILocationParams,
    @Body() body: UpdateLocationDto,
    @GetUserFromRequest() user,
  ) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Update,
      new this.locationModel(),
    );
    return this.locationsService.updateLocation(params, body, user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete('/admin/locations/:children/:id')
  delete(@Param() params: ILocationParams, @GetUserFromRequest() user) {
    ForbiddenError.from(defineAbility(user)).throwUnlessCan(
      Action.Delete,
      new this.locationModel(),
    );
    return this.locationsService.deleteLocation(params, user);
  }
}
