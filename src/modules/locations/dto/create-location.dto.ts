import {
  IsAlpha,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from '../../../common/enum';

export class CreateLocationDto {
  @IsOptional()
  addressItem: {
    area: string;
    address: string;
    map: string;
  };

  emailItem: {
    title: string;
    email: string;
    type: string;
  };

  phoneItem: {
    title: string;
    phone: string;
    type: string;
  };
}
