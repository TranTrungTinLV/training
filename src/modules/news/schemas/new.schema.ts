import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../../../modules/categories/schemas/categories.schema';
import { modeNewsEnum } from './enum/mode_news.enum';

export type NewDocument = HydratedDocument<New>;

@Schema({
  timestamps: true,
})
export class New {
  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop()
  summary: string;

  @Prop()
  content: string;

  @Prop()
  author: string;

  @Prop({ type: String, enum: Object.values(modeNewsEnum) })
  mode: string;

  @Prop()
  tags: [];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  categories: Category[];

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Date, default: new Date() })
  time_public: Date;

  @Prop()
  slug: string;
}
export const NewSchema = SchemaFactory.createForClass(New);
