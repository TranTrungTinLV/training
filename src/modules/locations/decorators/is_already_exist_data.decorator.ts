import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { LocationsRepository } from '../locations.repository';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDataAlReadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly locationsRepo: LocationsRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const location = await this.locationsRepo.findOne();

    if (_.every(location.listAddress, value)) {
      return false;
    } else if (_.every(location.listEmail, value)) {
      return false;
    } else if (_.every(location.listPhone, value)) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'duplicate data, please choose another value';
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDataAlReadyExistConstraint,
    });
  };
}
