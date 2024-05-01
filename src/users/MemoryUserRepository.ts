import User from "users/user.interface";
import IUserRepository from "./IUserRepository";

class MemoryUserRepository implements IUserRepository {
  private users: User[] = [
    {
      id: 1,
      firstName: "sogan",
      lastName: "yaya",
      email: "admin@gmail.com",
      password: "123456789",
    },
    {
      id: 2,
      firstName: "carmen",
      lastName: "yoyo",
      email: "carmen@gmail.com",
      password: "1234",
    },
  ];

  getAllUser(): User[] {
    return this.users;
  }

  getUserById(userId: Number): User | null {
    const index = this.users.findIndex((user) => user.id == userId);
    return index != -1 ? this.users[index] : null;
  }
}

export default MemoryUserRepository;
