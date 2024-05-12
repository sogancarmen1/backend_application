import UserNotFoundByIdException from "../exceptions/userNotFoundByIdException";
import { CreateUserDto } from "./user.dto";
import IUserRepository from "./iUser.repository";
import UserNotFoundByEmailException from "../exceptions/userNotFoundByEmailException";

class UserService {
  repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public async findUserById(idUser: Number) {
    const user = await this.repository.getUserById(idUser);
    if (user == null) throw new UserNotFoundByIdException(idUser);
    return user;
  }

  public async findAllUsers() {
    const value = await this.repository.getAllUser();
    return value;
  }

  public async findUserByEmail(emailUser: string) {
    const user = await this.repository.getUserByEmail(emailUser);
    if (user == null) throw new UserNotFoundByEmailException(emailUser);
    return user;
  }
  public async createdUser(user: CreateUserDto, passwordHashed: string) {
    await this.repository.createUser(user, passwordHashed);
  }
}

export default UserService;
