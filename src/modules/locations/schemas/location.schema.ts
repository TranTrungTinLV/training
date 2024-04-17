import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Type } from '../../../common/enum';

export type LocationDocument = HydratedDocument<Location>;
@Schema({
  timestamps: true,
})
export class Location {
  @Prop([
    raw({
      area: {
        type: String,
        required: 'Area is required',
      },
      address: {
        type: String,
        required: 'Destination is required',
      },
      map: {
        type: String,
        required: 'Map is required',
      },
    }),
  ])
  listAddress: [
    {
      area: string;
      address: string;
      map: string;
    },
  ];

  @Prop([
    raw({
      title: {
        type: String,
        required: 'Title is required',
      },
      email: {
        type: String,
        required: 'Email is required',
      },
      type: {
        type: String,
        required: 'Type email is required',
      },
    }),
  ])
  listEmail: [
    {
      title: string;
      email: string;
      type: string;
    },
  ];

  @Prop([
    raw({
      title: {
        type: String,
        required: 'Title is required',
      },
      phone: {
        type: String,
        required: 'Email is required',
      },
      type: {
        type: String,
        required: 'Type email is required',
      },
    }),
  ])
  listPhone: [
    {
      title: string;
      phone: string;
      type: string;
    },
  ];
}
export const LocationSchema = SchemaFactory.createForClass(Location);
