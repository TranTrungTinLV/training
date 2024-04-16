import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { commonEnum } from '../schemas/enum/common.enum';

export class CreateCommonDto {
  @IsEnum(commonEnum)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
