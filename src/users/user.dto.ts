import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
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

export class UpdateUserDto {
  @IsString()
  public firstName: string;
  @IsString()
  public lastName: string;
}

export class LoginDto {
  @IsString()
  public email: string;
  @IsString()
  public password: string;
}
