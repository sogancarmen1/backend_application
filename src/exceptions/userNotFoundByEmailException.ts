import HttpException from "./HttpException";

class UserNotFoundByEmailException extends HttpException {
  constructor(email: string) {
    super(404, `User with email ${email} not found`);
  }
}

export default UserNotFoundByEmailException;
