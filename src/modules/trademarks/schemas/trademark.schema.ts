import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { extend } from 'lodash';
import mongoose, { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ILicense } from '../interfaces/index';

export type TrademarkDocument = HydratedDocument<Trademark>;

@Schema({
  timestamps: true,
})
export class Trademark {
  @Prop()
  favicon: string;

  @Prop()
  logoIcon: string;

  @Prop()
  logoWord: string;

  @Prop()
  logo: string;

  @Prop({ type: String, default: '###' })
  copyRight: string;

  @Prop({
    type: [{ _id: SchemaTypes.ObjectId, text: String, images: [String] }],
  })
  license: ILicense[];
}
export const TrademarkSchema = SchemaFactory.createForClass(Trademark);
