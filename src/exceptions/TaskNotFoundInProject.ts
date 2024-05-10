import HttpException from "./HttpException";

class TaskNotFoundInProject extends HttpException {
  constructor(idProject: Number) {
    super(404, `Any task in project with id ${idProject}`);
  }
}

export default TaskNotFoundInProject;
