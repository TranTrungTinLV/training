import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommonDocument = HydratedDocument<Common>;

enum CommonEnum {
  training = 'training',
  product = 'product',
  vision = 'vision',
  mission = 'mission',
  introduce = 'introduce',
}

@Schema()
export class Common {
  @Prop({ unique: true })
  title: CommonEnum;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CommonSchema = SchemaFactory.createForClass(Common);
