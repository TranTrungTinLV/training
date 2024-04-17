import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TeamGroup } from '../../../modules/team-groups/schemas/team_group.schema';
import { TeamPosition } from '../../../modules/team-positions/schemas/team_position.schema';
import { User } from '../../../modules/users/schemas/users.schemas';

export type TeamDocument = HydratedDocument<Team>;

@Schema({
  timestamps: true,
})
export class Team {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  _uid: User;

  @Prop()
  academicLevel: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamPosition',
  })
  position: TeamPosition;

  @Prop()
  experience: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamGroup',
    },
  ])
  listGroup: TeamGroup[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);
