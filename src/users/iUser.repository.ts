import User from "users/user.interface";
import { CreateUserDto } from "./user.dto";
import { AddMemberDto } from "members/member.dto";

interface IUserRepository {
  getAllUser(): Promise<User[]>;
  getUserById(userId: Number): Promise<User> | Promise<null>;
  getUserByEmail(userEmail: string): Promise<User> | null;
  createUser(user: CreateUserDto, hashedPassword: string): Promise<User>;
  getAllUserWithEmailContainCharactere(userText: string): Promise<User[] | []>;
}

export default IUserRepository;
