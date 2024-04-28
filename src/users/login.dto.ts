import { IsString } from "class-validator";

class CreateLoginDto {
  @IsString()
  public email: string;
  @IsString()
  public password: string;
}

export default CreateLoginDto;
