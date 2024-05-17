import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  public name: string;
  @IsString()
  public userId: Number;
  @IsOptional()
  public description: string;
}

export class UpdateProjectDto {
  @IsString()
  public name: string;
  @IsOptional()
  public description: string;
}
