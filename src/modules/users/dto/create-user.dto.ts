import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Sex } from '../../../common/enum/index';
import { IsEmailOrPhone } from '../decorators/index';
import { IsValidAge } from '../../../common/decorators/index';
import { Transform, Type } from 'class-transformer';

export class FullName {
  @IsString()
  @IsNotEmpty()
  last: string;

  @IsString()
  @IsNotEmpty()
  first: string;
}
export class CreateUserDTO {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @Transform((params) => params.value.trim())
  @Transform((params) => params.value.toLowerCase())
  @IsEmailOrPhone()
  username: string;

  @Transform((params) => params.value.trim())
  @Matches(
    /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters)',
    },
  )
  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested()
  @Type(() => FullName)
  full_name: FullName;

  @IsOptional()
  @IsValidAge()
  birthday: { day: number; month: number; year: number };

  @IsEnum(Sex)
  sex: Sex;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Invalid code' })
  code: string;

  email: string;
  phone: string;
}
