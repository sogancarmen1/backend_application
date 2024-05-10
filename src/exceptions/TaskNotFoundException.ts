import HttpException from "./HttpException";

class TaskNotFoundException extends HttpException {
  constructor(id: Number) {
    super(404, `Task with id ${id} not found`);
  }
}

export default TaskNotFoundException;
