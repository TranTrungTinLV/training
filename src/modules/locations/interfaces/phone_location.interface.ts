import { IsNotEmpty, IsString, Matches } from "class-validator";
interface IPhoneLocation {
  title: string;
  phone: string;
  type: string;
}


export class PhoneLocation implements IPhoneLocation {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}