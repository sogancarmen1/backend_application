import UserNotFoundException from "../exceptions/UserNotFoundException";
import IUserRepository from "./IUserRepository";

class UserService {
  repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public async get_user_by_id(idUser: string) {
    const user = this.repository.getUserById(Number(idUser));
    if (user == null) {
      throw new UserNotFoundException(idUser);
    }
    return user;
  }

  public async get_all_users() {
    return this.repository.getAllUser();
  }
}

export default UserService;
