import { IsNumber, IsString } from "class-validator";

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
}
