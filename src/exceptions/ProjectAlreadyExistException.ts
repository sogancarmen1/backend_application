import HttpException from "./HttpException";

class ProjectAlreadyExistException extends HttpException {
  constructor(projectName: string) {
    super(400, `Project ${projectName} already exist`);
  }
}

export default ProjectAlreadyExistException;
