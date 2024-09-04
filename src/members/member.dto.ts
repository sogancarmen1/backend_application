import { IsEmail, IsString } from "class-validator";

export class AddMemberDto {
  @IsEmail()
  @IsString()
  public userEmail: string;
}

export class MemberConfig {
  @IsString()
  public idUser: Number;
  @IsString()
  public roleType: String;
}
