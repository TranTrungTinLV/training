import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { commonEnum } from './enum/common.enum';

export type CommonDocument = HydratedDocument<Common>;

@Schema()
export class Common {
  @Prop({ unique: true, enum: Object.values(commonEnum) })
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CommonSchema = SchemaFactory.createForClass(Common);
