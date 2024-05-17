import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  public name: string;
  @IsString()
  public dueDate: string;
  @IsString()
  public priority: string;
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
  public name: string;
  @IsString()
  public dueDate: string;
  @IsString()
  public priority: string;
  @IsString()
  public status: string;
  @IsOptional()
  @IsString()
  public description: string;
}

export class assignToDto {
  @IsString()
  public id: Number;
}
