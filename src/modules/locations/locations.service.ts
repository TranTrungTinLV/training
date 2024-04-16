import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLocationDto, UpdateLocationDto } from './dto/index';
import { LocationsRepository } from './locations.repository';
import { ILocationParams } from './interfaces/location_params.interface';
import * as _ from 'lodash';
import { LocationDocument } from './schemas/location.schema';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';
@Injectable()
export class LocationsService {
  constructor(
    private readonly locationsRepo: LocationsRepository,
    private readonly historiesService: HistoriesService,
  ) {}

  async getLocation(): Promise<LocationDocument> {
    const location = await this.locationsRepo.findOne();
    if (!location) {
      throw new NotFoundException('Location is empty');
    }
    return location;
  }

  async createLocation(
    children: string,
    body: CreateLocationDto,
    user: IUserFromRequest,
  ): Promise<LocationDocument> {
    let location = await this.locationsRepo.findOne();
    if (!location) {
      location = await this.locationsRepo.create();
    }

    switch (children) {
      case 'address': {
        const { area, map, address } = body.addressItem;

        if (
          _.some(location.listAddress, {
            area,
            map,
            address,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listAddress: { area, map, address } } },
          { new: true },
        );
        break;
      }

      case 'email': {
        const { title, email, type } = body.emailItem;
        if (
          _.some(location.listEmail, {
            title,
            email,
            type,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listEmail: { title, email, type } } },
          { new: true },
        );
        break;
      }

      case 'phone': {
        const { title, type, phone } = body.phoneItem;

        if (
          _.some(location.listPhone, {
            title,
            type,
            phone,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listPhone: { title, type, phone } } },
          { new: true },
        );
        break;
      }
      default:
        throw new UnprocessableEntityException(
          `Invalid params ${children} value!`,
        );
    }

    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Add new location`,
    });

    return this.locationsRepo.findOne();
  }
  async updateLocation(
    params: ILocationParams,
    body: UpdateLocationDto,
    user: IUserFromRequest,
  ): Promise<LocationDocument> {
    const { id, children } = params;

    let location = await this.locationsRepo.findOne();
    if (!location) {
      location = await this.locationsRepo.create();
    }

    switch (children) {
      case 'address': {
        const { address, area, map } = body.addressItem;

        if (
          _.some(location.listAddress, {
            area,
            map,
            address,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.updateOne(
          { _id: location._id, 'listAddress._id': id.toString() },
          { $set: { 'listAddress.$': { address, area, map } } },
          { new: true },
        );
        break;
      }

      case 'email': {
        const { title, email, type } = body.emailItem;

        if (
          _.some(location.listEmail, {
            title,
            email,
            type,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.updateOne(
          { _id: location._id, 'listEmail._id': id.toString() },
          {
            $set: {
              'listEmail.$': {
                title,
                email,
                type,
              },
            },
          },
          { new: true },
        );
        break;
      }

      case 'phone': {
        const { title, type, phone } = body.phoneItem;

        if (
          _.some(location.listPhone, {
            title,
            type,
            phone,
          })
        ) {
          throw new BadRequestException(
            'Duplicate data, please use difference data',
          );
        }

        await this.locationsRepo.updateOne(
          { _id: location._id, 'listPhone._id': id.toString() },
          { $set: { 'listPhone.$': { title, type, phone } } },
          { new: true },
        );
        break;
      }
      default:
        throw new UnprocessableEntityException(
          `Invalid params ${children} value!`,
        );
    }

    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Update location`,
    });

    return this.locationsRepo.findOne();
  }

  async deleteLocation(params: ILocationParams, user: IUserFromRequest) {
    const { id, children } = params;

    const location = await this.locationsRepo.findOne();
    if (!location) {
      throw new NotFoundException('Location is empty!');
    }

    switch (children) {
      case 'address': {
        await this.locationsRepo.updateOne(
          { _id: location._id, 'listAddress._id': id },
          { $pull: { listAddress: { _id: id } } },
        );
        break;
      }
      case 'email': {
        await this.locationsRepo.updateOne(
          { _id: location._id, 'listEmail._id': id },
          { $pull: { listEmail: { _id: id } } },
        );
        break;
      }
      case 'phone': {
        await this.locationsRepo.updateOne(
          { _id: location._id, 'listPhone._id': id },
          { $pull: { listPhone: { _id: id } } },
        );
        break;
      }
      default:
        throw new UnprocessableEntityException(
          `Invalid params ${children} value!`,
        );
    }
    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Delete location`,
    });
  }
}
