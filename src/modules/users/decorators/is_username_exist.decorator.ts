import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRepository } from '../users.repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint()
export class IsUserNameExistConstraint implements ValidatorConstraintInterface {
  constructor(private userRepo: UserRepository) {}
  async validate(value: string): Promise<boolean> {
    const user = await this.userRepo.findByUserName(value);
    if (user) return false;
    return true;
  }
  defaultMessage(): string {
    return 'username already exists, please choose another username';
  }
}

export function IsUserNameExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNameExistConstraint,
    });
  };
}
