import { IsNumber, IsString } from "class-validator";

class CreateTaskDto {
  @IsNumber()
  public id: Number;
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

export default CreateTaskDto;
