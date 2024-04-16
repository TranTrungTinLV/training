import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Sex } from '../../../common/enum';
import { PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class CreateUserFlTeamsDTO extends PickType(CreateUserDTO, [
  'full_name',
  'sex',
  'avatar',
] as const) {
  @IsEmail()
  email: string;

  @Matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsString()
  password: string;
}
