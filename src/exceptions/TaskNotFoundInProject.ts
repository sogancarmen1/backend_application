import HttpException from "./HttpException";

class TaskNotFoundByIdInProject extends HttpException {
  constructor(idTask: Number, idProject: Number) {
    super(
      404,
      `Task with id ${idTask} not found in project with id ${idProject}`
    );
  }
}

export default TaskNotFoundByIdInProject;
