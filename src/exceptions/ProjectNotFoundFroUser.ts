import HttpException from "./HttpException";

class ProjectNotFoundUser extends HttpException {
  constructor(id: Number) {
    super(404, `The user with id ${id} have not project`);
  }
}

export default ProjectNotFoundUser;
