import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  public firstName: string;
  @IsString()
  public lastName: string;
  @IsString()
  public email: string;
  @IsString()
  public password: string;
  @IsString()
  public confirmPassword: string;
}

export default CreateUserDto;
