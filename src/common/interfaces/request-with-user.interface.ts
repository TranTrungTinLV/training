import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    _id: string;
    username: string;
    password: string;
  };
}
