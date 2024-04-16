import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Slide } from '../../../modules/slides/schemas/slide.schema';
import { TypeEffect } from '../../../modules/type-effects/schemas/type_effect.schema';

export type TypeSlideDocument = HydratedDocument<TypeSlide>;
@Schema({
  timestamps: true,
})
export class TypeSlide {
  @Prop()
  type: string;

  @Prop({
    type: [{ idSlide: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide' } }],
  })
  Slide: Slide[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeEffect',
  })
  effect: TypeEffect;

  @Prop()
  display: boolean;
}
export const TypeSlideSchema = SchemaFactory.createForClass(TypeSlide);
