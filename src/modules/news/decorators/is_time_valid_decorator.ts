import { registerDecorator, ValidationArguments } from 'class-validator';
import { modeNewsEnum } from 'src/modules/news/schemas/enum/mode_news.enum';

export function IsTimeValid(property: string, args?: ValidationArguments) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsTimeValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValue === modeNewsEnum.pending && value <= new Date()) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `Mode is pending require time public must be greater than current date`;
        },
      },
    });
  };
}
