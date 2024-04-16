import { IsEmail, IsNotEmpty, IsString } from "class-validator";

interface IEmailLocation {
  title: string;
  email: string;
  type: string;
}

export class EmailLocation implements IEmailLocation {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}