import { IsNumber, IsString } from "class-validator";

class CreatePostDto {
  @IsNumber()
  public id: Number;

  @IsString()
  public author: string;

  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreatePostDto;
