import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsString()
  @IsOptional()
  public userId: Number;
  @IsOptional()
  public description: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
}
