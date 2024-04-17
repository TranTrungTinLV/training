import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

enum StatusContact {
  View = 'View',
  UnView = 'UnView',
}

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: String, default: '####' })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  content: string;

  @Prop({ type: String, default: StatusContact.UnView })
  status: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
