import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { IsPhoneAlreadyExist } from '../decorators/is_already_exist_phone.decorator';

export class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsPhoneAlreadyExist()
  number: string;
}
