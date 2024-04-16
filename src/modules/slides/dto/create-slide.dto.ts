import { IsString } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  navigate: string;
}
