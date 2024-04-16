import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
