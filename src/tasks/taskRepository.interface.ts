import { CreateTaskDto, updateTaskDto } from "tasks/tasks.dto";
import Task from "tasks/tasks.interface";

interface ITaskRepository {
  getAllTasksByProject(projectId: Number): Promise<Task[] | []>;
  createTask(task: CreateTaskDto): Promise<Task>;
  updateTask(taskId: Number, task: updateTaskDto): Promise<Task>;
  deleteTask(taskId: Number): Promise<void>;
  getTaskById(taskId: Number): Promise<Task | null>;
  isTaskByNameExist(taskName: string, projectId: Number): Promise<boolean>;
}

export default ITaskRepository;
