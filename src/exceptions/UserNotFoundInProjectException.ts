import HttpException from "./HttpException";

class UserNotFoundInProjectException extends HttpException {
  constructor(idUser: Number, idProject: Number) {
    super(
      404,
      `User with id ${idUser} not found in project with id ${idProject}`
    );
  }
}

export default UserNotFoundInProjectException;
