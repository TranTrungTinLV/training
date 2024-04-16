import { IsNotEmpty, IsString } from "class-validator";
interface IAddressLocation {
  area: string;
  address: string;
  map: string;
}

export class AddressLocation implements IAddressLocation {
  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  map: string;
}