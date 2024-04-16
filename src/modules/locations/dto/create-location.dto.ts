import { IsOptional, ValidateNested } from 'class-validator';
import {
  AddressLocation,
  EmailLocation,
  PhoneLocation,
} from '../interfaces/index';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ValidateNested()
  @Type(() => AddressLocation)
  addressItem: AddressLocation;

  @ValidateNested()
  @Type(() => EmailLocation)
  emailItem: EmailLocation;

  @ValidateNested()
  @Type(() => PhoneLocation)
  phoneItem: PhoneLocation;
}
