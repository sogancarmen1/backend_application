import User from "users/user.interface";

interface IUserRepository {
  getAllUser(): User[];
  getUserById(userId: Number): User | null;
}

export default IUserRepository;
