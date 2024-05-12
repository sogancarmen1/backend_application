import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsLowercase()
  public email: string;
  @IsString()
  @IsNotEmpty()
  public firstName: string;
  @IsString()
  @IsNotEmpty()
  public lastName: string;
  @IsString()
  @IsStrongPassword()
  public password: string;
  @IsString()
  public confirmPassword: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;
  @IsString()
  @IsNotEmpty()
  public lastName: string;
}

export class LoginDto {
  @IsString()
  public email: string;
  @IsString()
  public password: string;
}
