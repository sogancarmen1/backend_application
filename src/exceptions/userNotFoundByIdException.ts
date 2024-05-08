import HttpException from "./HttpException";

class UserNotFoundByIdException extends HttpException {
  constructor(id: Number) {
    super(404, `User with id ${id} not found`);
  }
}

export default UserNotFoundByIdException;
