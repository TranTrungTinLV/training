import { Types } from 'mongoose';

export interface ILicense {
  _id: Types.ObjectId;
  text: string;
  images: string[];
}
