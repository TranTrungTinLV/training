import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../../modules/users/schemas/users.schemas';

export type HistoryDocument = HydratedDocument<History>;

@Schema({
  timestamps: true,
})
export class History {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _uid: User;

  @Prop()
  time: Date;

  @Prop()
  action: string;

  @Prop()
  object: object;
}
