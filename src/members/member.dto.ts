import { IsString } from "class-validator";

class AddMemberDto {
  @IsString()
  public idUser: Number;
  @IsString()
  public idProject: Number;
  @IsString()
  public roleType: String;
}

export default AddMemberDto;
