import HttpException from "./HttpException";

class TaskIsNotAssigned extends HttpException {
  constructor(idTask: Number) {
    super(404, `Task with id ${idTask} isn't assigned`);
  }
}

export default TaskIsNotAssigned;
