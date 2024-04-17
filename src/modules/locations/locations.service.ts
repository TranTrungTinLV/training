import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsRepository } from './locations.repository';
import * as _ from 'lodash';
import { LocationDocument } from './schemas/location.schema';
import { ILocationParams } from './interfaces/location_params.interface';
@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepository: LocationsRepository) {}
  async createLocation(children: string, body: CreateLocationDto) {
    let location = await this.locationsRepository.findOne();
    if (!location) {
      location = await this.locationsRepository.create();
    }
    switch (children) {
      case 'address': {
        const data = body.addressItem;
        await this.locationsRepository.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listAddress: data } },
          { new: true },
        );
        break;
      }
      case 'email': {
        const data = body.emailItem;
        await this.locationsRepository.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listEmail: data } },
          { new: true },
        );
        break;
      }
      case 'phone': {
        const data = body.phoneItem;
        await this.locationsRepository.findByIdAndUpdate(
          location._id.toString(),
          { $push: { listPhone: data } },
          { new: true },
        );
        break;
      }
      default:
        throw new UnprocessableEntityException(
          `Invalid params ${children} value!`,
        );
    }

    return this.locationsRepository.findOne();
  }
  async updateLocation(params: ILocationParams, body: UpdateLocationDto) {
    const { id, children } = params;

    let location = await this.locationsRepository.findOne();
    if (!location) {
      location = await this.locationsRepository.create();
    }
    switch (children) {
      case 'address': {
        const data = body.addressItem;
        await this.locationsRepository.updateOne(
          { _id: location._id, 'listAddress._id': id.toString() },
          { $set: { 'listAddress.$': data } },
          { new: true },
        );
        break;
      }
      case 'email': {
        const data = body.emailItem;
        await this.locationsRepository.updateOne(
          { _id: location._id, 'listEmail._id': id.toString() },
          { $set: { 'listEmail.$': data } },
          { new: true },
        );
        break;
      }
      case 'phone': {
        const data = body.phoneItem;
        await this.locationsRepository.updateOne(
          { _id: location._id, 'listPhone._id': id.toString() },
          { $set: { 'listPhone.$': data } },
          { new: true },
        );
        break;
      }
      default:
        throw new UnprocessableEntityException(
          `Invalid params ${children} value!`,
        );
    }
    return this.locationsRepository.findOne();
  }
  async deleteLocation(params: ILocationParams) {
    const { id, children } = params;
    const location = await this.locationsRepository.findOne();
    if (!location) {
      throw new NotFoundException('Location is empty!');
    }

    switch (children) {
      case 'address': {
        await this.locationsRepository.updateOne(
          { _id: location._id, 'listAddress._id': id },
          { $pull: { listAddress: { _id: id } } },
        );
        break;
      }
      case 'email': {
        await this.locationsRepository.updateOne(
          { _id: location._id, 'listEmail._id': id },
          { $pull: { listEmail: { _id: id } } },
        );
        break;
      }
      case 'phone': {
        await this.locationsRepository.updateOne(
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

    return this.locationsRepository.findOne();
  }
}
