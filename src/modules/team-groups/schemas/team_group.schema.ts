import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Team } from '../../../modules/teams/schemas/team.schema';

export type TeamGroupDocument = HydratedDocument<TeamGroup>;
@Schema({
  timestamps: true,
})
export class TeamGroup {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
  ])
  listMember: Team[];
}
export const TeamGroupSchema = SchemaFactory.createForClass(TeamGroup);
