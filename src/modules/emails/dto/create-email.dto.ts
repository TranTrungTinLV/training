import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  addr: string;
}
