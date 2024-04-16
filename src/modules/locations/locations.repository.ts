import { BaseRepository } from '../../base.repository';
import { Location, LocationDocument } from './schemas/location.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsRepository extends BaseRepository<LocationDocument> {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {
    super(locationModel);
  }
}
