import HttpException from "./HttpException";

class ProjectNotFoundUser extends HttpException {
  constructor(id: string) {
    super(404, `The user with id ${id} have not project`);
  }
}

export default ProjectNotFoundUser;
