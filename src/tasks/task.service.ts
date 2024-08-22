import ProjectService from "projects/project.service";
import ITaskRepository from "./taskRepository.interface";
import TaskNotFoundException from "../exceptions/TaskNotFoundException";
import TasksNotFoundInProject from "../exceptions/TasksNotFoundInProject";
import TaskAlreadyExistException from "../exceptions/TaskAlreadyExistExceptions";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";
import UserService from "users/user.service";
import TaskNotFoundByIdInProject from "../exceptions/TaskNotFoundInProject";
import TaskIsNotAssigned from "../exceptions/TaskIsNotAssigned";

class TaskService {
  repository: ITaskRepository;
  projectService: ProjectService;
  userService: UserService;
  constructor(
    repository: ITaskRepository,
    projectService: ProjectService,
    userService: UserService
  ) {
    this.repository = repository;
    this.projectService = projectService;
    this.userService = userService;
  }

  public async findTaskByIdInProject(idTask: Number, idProject: Number) {
    const task = await this.repository.getTaskByIdInProject(idTask, idProject);
    if (task == null) throw new TaskNotFoundByIdInProject(idTask, idProject);
    return task;
  }

  public async assignTo(idTask: Number, user: assignToDto) {
    await this.userService.findUserById(user.id);
    await this.projectService.findProjectById(user.idProject);
    await this.findTaskById(idTask);
    await this.findTaskByIdInProject(idTask, user.idProject);
    await this.projectService.findMemberById(user.idProject, user.id);
    const value = await this.repository.assignTo(idTask, user);
    return value;
  }

  public async referTo(idProject: Number, taskId: Number) {
    await this.projectService.findProjectById(idProject);
    await this.findTaskById(taskId);
    await this.findTaskByIdInProject(taskId, idProject);
    const isAssigned = await this.repository.isAssignedTo(taskId, idProject);
    if (isAssigned == false) throw new TaskIsNotAssigned(taskId);
    await this.repository.referTo(idProject, taskId);
  }

  public async findAllTasksByProject(idProject: Number) {
    await this.projectService.findProjectById(idProject);
    const allTasks = await this.repository.getAllTasksByProject(idProject);
    // if (allTasks.length == 0) throw new TasksNotFoundInProject(idProject);
    return allTasks;
  }

  public async findTaskById(idTask: Number) {
    const taskById = await this.repository.getTaskById(idTask);
    if (taskById == null) throw new TaskNotFoundException(idTask);
    return taskById;
  }

  public async checkIfTaskNameAlreadyExistsInProject(
    taskName: string,
    projectId: Number
  ) {
    const idTaskExist = await this.repository.isTaskByNameExist(
      taskName,
      projectId
    );
    if (idTaskExist == true) throw new TaskAlreadyExistException(taskName);
  }

  public async deleteTask(idTask: Number) {
    await this.findTaskById(idTask);
    await this.repository.deleteTask(idTask);
  }

  public async createTask(task: CreateTaskDto) {
    await this.projectService.findProjectById(task.projectId);
    if (task.assignedTo != undefined) {
      const user = await this.userService.findUserByEmail(task.assignedTo);
      await this.projectService.findMemberById(task.projectId, user.id);
    }
    await this.checkIfTaskNameAlreadyExistsInProject(task.name, task.projectId);
    const result = await this.repository.createTask(task);
    return result;
  }

  public async updateTask(idTask: Number, taskUpdated: updateTaskDto) {
    const task = await this.findTaskById(idTask);
    await this.checkIfTaskNameAlreadyExistsInProject(
      taskUpdated.name,
      task.projectId
    );
    const taskUpdate = this.repository.updateTask(idTask, taskUpdated);
    return taskUpdate;
  }
}

export default TaskService;
