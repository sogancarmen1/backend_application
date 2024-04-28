import HttpException from "./HttpException";

class ProjectNotFoundUser extends HttpException {
  constructor(id: string) {
    super(400, `The user with id ${id} have not project`);
  }
}

export default ProjectNotFoundUser;
