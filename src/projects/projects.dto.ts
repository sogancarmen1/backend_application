import { IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  public projectName: string;
  @IsString()
  public userId: string;
}

export class UpdateProjectDto {
  @IsString()
  public projectName: string;
}

