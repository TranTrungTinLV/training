import { BaseRepository } from '../../base.repository';
import { Email, EmailDocument } from './schema/email.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsRepository extends BaseRepository<EmailDocument> {
  constructor(
    @InjectModel(Email.name) private readonly emailModel: Model<EmailDocument>,
  ) {
    super(emailModel);
  }
}
