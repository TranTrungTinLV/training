import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Sex } from '../../../common/enum';
import { Status } from './enum/status.enum';
import { Role } from 'src/modules/roles/schemas/role.schema';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  avatar: string;

  @Prop(raw({ first: String, last: String }))
  full_name: { first: string; last: string };

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop(raw({ blocked: { type: Boolean, default: false }, unlock: Date }))
  block: { blocked: boolean; unlock: Date };

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  })
  role: Role[];

  @Prop()
  birthday: Date;

  @Prop({ type: String, enum: Object.values(Sex) })
  sex: string;

  @Prop()
  address: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: String, enum: Object.values(Status), default: 'offline' })
  status: string;

  @Prop()
  loggedAt: Date;

  @Prop()
  action: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});
