import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TypeEffectDocument = HydratedDocument<TypeEffect>;
@Schema()
export class TypeEffect {
  @Prop()
  type: string;
}
export const TypeEffectSchema = SchemaFactory.createForClass(TypeEffect);
