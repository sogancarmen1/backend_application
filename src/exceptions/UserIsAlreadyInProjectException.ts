import HttpException from "./HttpException";

class UserIsAlreadyInProjectException extends HttpException {
  constructor(idUser: Number, idProject: Number) {
    super(
      400,
      `User with id ${idUser} already member of project with id ${idProject}`
    );
  }
}

export default UserIsAlreadyInProjectException;
