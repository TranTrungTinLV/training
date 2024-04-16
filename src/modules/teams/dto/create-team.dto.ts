import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Sex } from '../../../common/enum';
import { IsValidAge } from '../../../common/decorators/index';

export class CreateTeamDto {
  @Transform((params) => params.value.trim())
  @Transform((params) => params.value.toLowerCase())
  @IsEmail()
  email: string;

  @Matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  academicLevel: string;

  @IsString()
  position: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  groupId: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  full_name: { last: string; first: string };

  @IsEnum(Sex)
  sex: Sex;

  @Transform(({ value }) => JSON.parse(value))
  @IsValidAge()
  birthday: { day: number; month: number; year: number };
}
