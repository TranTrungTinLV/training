import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type EmailDocument = HydratedDocument<Email>;

@Schema({
  timestamps: true,
})
export class Email {
  @Prop({ type: String, unique: true, trim: true })
  address: string;

  @Prop({ type: String, trim: true })
  code: string;

  @Prop({ type: Number, default: 3, max: 3, min: 0 })
  attempts: number;
}
export const EmailSchema = SchemaFactory.createForClass(Email);

EmailSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.code = await bcrypt.hash(this.code, salt);
  next();
});
