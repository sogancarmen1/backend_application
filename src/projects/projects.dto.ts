import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  public projectName: string;
  @IsString()
  public userId: Number;
  @IsOptional()
  public description: string;
}

export class UpdateProjectDto {
  @IsString()
  public projectName: string;
  @IsOptional()
  public description: string;
}
