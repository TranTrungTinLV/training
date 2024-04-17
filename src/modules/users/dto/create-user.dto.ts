import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Sex } from '../../../common/enum/index';
import { IsEmailOrPhone } from '../decorators/is_valid_username.decorator';
import { IsGreaterThanFive } from '../../../common/decorators/is_valid_age.decorator';
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
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested()
  @Type(() => FullName)
  full_name: FullName;

  @IsOptional()
  @IsGreaterThanFive()
  birthday: { day: number; month: number; year: number };

  @IsEnum(Sex)
  sex: Sex;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Invalid code' })
  code: string;
}
