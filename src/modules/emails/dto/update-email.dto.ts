import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailDto } from './create-email.dto';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString() username: string;
}
