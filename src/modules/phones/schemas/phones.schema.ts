import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type PhoneDocument = HydratedDocument<Phone>;

@Schema({ timestamps: true })
export class Phone {
  @Prop()
  number: string;

  @Prop()
  code: string;

  @Prop({ type: Number, max: 3, min: 0, default: 3 })
  attempts: number;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);

PhoneSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.code = await bcrypt.hash(this.code, salt);
  next();
});
