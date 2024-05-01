import { IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  public projectName: string;
  @IsString()
  public userId: Number;
}

export class UpdateProjectDto {
  @IsString()
  public projectName: string;
}

