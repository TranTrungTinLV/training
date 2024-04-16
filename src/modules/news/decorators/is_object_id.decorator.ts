import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isObjectId } from '../../../common/utils/index';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const categories = Array.isArray(value)
            ? value
            : value.split(',').filter(Boolean);

          if (typeof value === 'string' && categories.length > 1) {
            if (
              categories.every(
                (category: string) => isObjectId(category) === true,
              )
            ) {
              return true;
            }
            return false;
          }

          if (typeof value === 'string' && categories.length <= 1) {
            if (isObjectId(value)) {
              return true;
            }
            return false;
          }

          if (Array.isArray(value)) {
            if (
              categories.every(
                (category: string) => isObjectId(category) === true,
              )
            ) {
              return true;
            }
            return false;
          }
        },
        defaultMessage: (args: ValidationArguments) => {
          return `${args.property} has value isn't a ObjectID`;
        },
      },
    });
  };
}
