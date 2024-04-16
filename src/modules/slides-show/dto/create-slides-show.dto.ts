import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { EffectEnum } from '../schemas/enum/effect.enum';
import { IsObjectId } from 'src/modules/news/decorators';

export class CreateSlidesShowDto {
  @IsString()
  name: string;

  @IsObjectId({ each: true })
  @IsArray()
  slides: string[];

  @IsEnum(EffectEnum)
  effect: string;


  @IsOptional()
  display: boolean;
}
