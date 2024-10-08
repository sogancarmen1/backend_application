import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsOptional()
  @IsString()
  public dueDate: string;
  @IsOptional()
  @IsString()
  public priority: string;
  @IsOptional()
  @IsString()
  public status: string;
  @IsNumber()
  public projectId: Number;
  @IsOptional()
  @IsString()
  @IsEmail()
  public assignedTo: string;
  @IsOptional()
  public description: string;
}

export class updateTaskDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsOptional()
  @IsString()
  public dueDate: string;
  @IsOptional()
  @IsString()
  public priority: string;
  @IsOptional()
  @IsString()
  public status: string;
  @IsOptional()
  @IsString()
  public description: string;
}

export class assignToDto {
  @IsString()
  @IsEmail()
  public userEmail: string;
  @IsString()
  public idProject: Number;
}
