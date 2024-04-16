import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Slide } from '../../../modules/slides/schemas/slide.schema';
import { EffectEnum } from './enum/effect.enum';

export type SlideShowDocument = HydratedDocument<SlideShow>;

@Schema({
  timestamps: true,
})
export class SlideShow {
  @Prop()
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Slide' }])
  slides: Types.ObjectId[];

  @Prop({ type: String, enum: Object.values(EffectEnum) })
  effect: string;

  @Prop()
  display: boolean;
}

export const SlideShowSchema = SchemaFactory.createForClass(SlideShow);
