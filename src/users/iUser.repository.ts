import User from "users/user.interface";
import { CreateUserDto } from "./user.dto";

interface IUserRepository {
  getAllUser(): Promise<User[]>;
  getUserById(userId: Number): Promise<User> | Promise<null>;
  getUserByEmail(userEmail: string): Promise<User> | null;
  createUser(user: CreateUserDto, hashedPassword: string): Promise<null>;
}

export default IUserRepository;
