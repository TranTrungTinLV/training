import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { commonEnum } from '../../../common/enum';

export class CreateCommonDto {
  @IsEnum(commonEnum)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
