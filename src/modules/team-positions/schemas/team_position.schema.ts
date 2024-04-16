import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeamPositionDocument = HydratedDocument<TeamPosition>;

@Schema({
  timestamps: true,
})
export class TeamPosition {
  @Prop({ type: String, unique: true })
  name: string;
}

export const TeamPositionSchema = SchemaFactory.createForClass(TeamPosition);
