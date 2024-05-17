import { assignToDto, CreateTaskDto, updateTaskDto } from "tasks/tasks.dto";
import Task from "tasks/tasks.interface";

interface ITaskRepository {
  getAllTasksByProject(projectId: Number): Promise<Task[] | []>;
  createTask(task: CreateTaskDto): Promise<Task>;
  updateTask(taskId: Number, task: updateTaskDto): Promise<Task>;
  deleteTask(taskId: Number): Promise<void>;
  getTaskById(taskId: Number): Promise<Task | null>;
  isTaskByNameExist(taskName: string, projectId: Number): Promise<boolean>;
  assignTo(
    idProject: Number,
    idTask: Number,
    userId: assignToDto
  ): Promise<Task | null>;
  isAssignedTo(idTask: Number, idProject: Number): Promise<boolean>;
  getTaskByIdInProject(idTask: Number, idProject: Number): Promise<Task | null>;
  referTo(idProject: Number, taskId: Number): Promise<void>;
}

export default ITaskRepository;
