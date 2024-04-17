import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema()
export class Categories {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }] })
  children: Types.ObjectId[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
