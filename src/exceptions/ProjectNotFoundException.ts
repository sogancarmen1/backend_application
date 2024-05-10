import HttpException from "./HttpException";

class ProjectNotFoundException extends HttpException {
  constructor(id: Number) {
    super(404, `Project with id ${id} not found`);
  }
}

export default ProjectNotFoundException;
