import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLicenseDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
