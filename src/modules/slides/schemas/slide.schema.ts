import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TypeSlide } from '../../../modules/type-slides/schemas/type-slides.schema';

export type SlideDocument = HydratedDocument<Slide>;

@Schema({
  timestamps: true,
})
export class Slide {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  order: number;

  @Prop()
  navigate: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TypeSlide' })
  type: TypeSlide;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
