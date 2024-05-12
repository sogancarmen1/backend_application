import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  public taskName: string;
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
  public taskName: string;
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
  @IsEmail()
  public email: string;
  @IsString()
  public taskId: Number;
}
