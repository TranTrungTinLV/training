import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGreaterThanFive(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanFive',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: any, args: ValidationArguments) => {
          return (
            new Date().getFullYear() -
              new Date(value.year, value.month).getFullYear() >
            5
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than 5 or older`;
        },
      },
    });
  };
}
