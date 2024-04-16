import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../../../modules/users/schemas/users.schemas';

export type HistoryDocument = HydratedDocument<History>;

@Schema({
  timestamps: true,
})
export class History {
  _id: false;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  _uid: User | Types.ObjectId;

  @Prop()
  time: Date;

  @Prop()
  action: string;

  @Prop({ type: Object })
  object: Object;
}

export const HistorySchema = SchemaFactory.createForClass(History);
