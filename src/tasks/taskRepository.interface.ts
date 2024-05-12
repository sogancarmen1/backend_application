import { assignToDto, CreateTaskDto, updateTaskDto } from "tasks/tasks.dto";
import Task from "tasks/tasks.interface";

interface ITaskRepository {
  getAllTasksByProject(projectId: Number): Promise<Task[] | []>;
  createTask(task: CreateTaskDto): Promise<Task>;
  updateTask(taskId: Number, task: updateTaskDto): Promise<Task>;
  deleteTask(taskId: Number): Promise<void>;
  getTaskById(taskId: Number): Promise<Task | null>;
  isTaskByNameExist(taskName: string, projectId: Number): Promise<boolean>;
  assingTo(email: assignToDto, idProject: Number): Promise<Task>;
  referTo(idProject: Number, taskId: Number): Promise<void>;
}

export default ITaskRepository;
