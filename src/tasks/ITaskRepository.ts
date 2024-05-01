import { CreateTaskDto, updateTaskDto } from "tasks/tasks.dto";
import Task from "tasks/tasks.interface";

interface ITaskRepository {
  getTasksByProject(projectId: Number): Task[] | null;
  createTask(task: CreateTaskDto): string;
  updateTask(taskId: Number, task: updateTaskDto): Task | null;
  deleteTask(taskId: Number): string;
  getTaskById(taskId: Number): Task | null;
}

export default ITaskRepository;
