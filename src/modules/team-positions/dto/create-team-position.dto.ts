import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamPositionDto {
  @IsString() @IsNotEmpty() name: string;
}
