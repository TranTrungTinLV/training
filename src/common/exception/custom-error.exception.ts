import { HttpException } from '@nestjs/common';

export class CustomErrorException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}
