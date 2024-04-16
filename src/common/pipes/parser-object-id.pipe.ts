import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isObjectId } from '../utils/index';

@Injectable()
export class ParserObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string, args: ArgumentMetadata): string {
    if (!isObjectId(value)) {
      throw new BadRequestException('Is not a valid objectId');
    }
    return value;
  }
}
