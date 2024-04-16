import { Request } from 'express';

export interface IUserCredentials extends Request {
  user: {
    _id: string;
    username: string;
    password: string;
  };
}
