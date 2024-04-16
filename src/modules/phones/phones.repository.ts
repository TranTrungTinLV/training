import { InjectModel } from '@nestjs/mongoose';
import { Phone, PhoneDocument } from './schemas/phones.schema';
import { BaseRepository } from 'src/base.repository';
import { Model } from 'mongoose';

export class PhonesRepository extends BaseRepository<PhoneDocument> {
  constructor(
    @InjectModel(Phone.name) private readonly phoneModel: Model<PhoneDocument>,
  ) {
    super(phoneModel);
  }
}
