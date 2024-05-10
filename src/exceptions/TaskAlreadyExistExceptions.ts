import HttpException from "./HttpException";

class TaskAlreadyExistException extends HttpException {
  constructor(taskName: string) {
    super(400, `Project ${taskName} already exist`);
  }
}

export default TaskAlreadyExistException;
