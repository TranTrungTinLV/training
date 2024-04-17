import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @Prop()
  name: string;

  @Prop({
    type: Array,
    default: [],
  })
  permissions: [];
}
export const RoleSchema = SchemaFactory.createForClass(Role);
