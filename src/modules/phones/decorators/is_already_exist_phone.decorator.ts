import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { PhonesRepository } from '../phones.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPhoneAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly phonesRepo: PhonesRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const isAlreadyExist = await this.phonesRepo.findOne({ number: value });
    if (isAlreadyExist) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'duplicate number, please choose another value';
  }
}

export function IsPhoneAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneAlreadyExistConstraint,
    });
  };
}
