import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Sex } from '../../../common/enum';

export class CreateUserFlTeamsDTO {
  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  password: string;

  @IsEnum(Sex)
  sex: Sex;

  @IsObject()
  full_name: { last: string; first: string };
}
