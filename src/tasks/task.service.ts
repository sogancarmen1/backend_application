import ProjectService from "projects/project.service";
import ITaskRepository from "./taskRepository.interface";
import TaskNotFoundException from "../exceptions/TaskNotFoundException";
import TaskNotFoundInProject from "../exceptions/TaskNotFoundInProject";
import TaskAlreadyExistException from "../exceptions/TaskAlreadyExistExceptions";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";
import UserService from "users/user.service";

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

  public async assinTo(emailUser: assignToDto, idProject: Number) {
    const user = await this.userService.findUserByEmail(emailUser.email);
    await this.projectService.findProjectByIdForUser(idProject);
    await this.findTaskById(emailUser.taskId);
    await this.projectService.findMemberById(idProject, user.id);
    const value = await this.repository.assingTo(emailUser, idProject);
    return value;
  }

  public async referTo(idProject: Number, taskId: Number) {
    await this.projectService.findProjectByIdForUser(idProject);
    await this.findTaskById(taskId);
    await this.repository.referTo(idProject, taskId);
  }

  public async findAllTasksByProject(idProject: Number) {
    await this.projectService.findProjectByIdForUser(idProject);
    const allTasks = await this.repository.getAllTasksByProject(idProject);
    if (allTasks.length == 0) throw new TaskNotFoundInProject(idProject);
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
    await this.projectService.findProjectByIdForUser(task.projectId);
    if (task.assignedTo != undefined) {
      const user = await this.userService.findUserByEmail(task.assignedTo);
      await this.projectService.findMemberById(task.projectId, user.id);
    }
    await this.checkIfTaskNameAlreadyExistsInProject(
      task.taskName,
      task.projectId
    );
    const result = await this.repository.createTask(task);
    return result;
  }

  public async updateTask(idTask: Number, taskUpdated: updateTaskDto) {
    const task = await this.findTaskById(idTask);
    await this.checkIfTaskNameAlreadyExistsInProject(
      taskUpdated.taskName,
      task.projectId
    );
    const taskUpdate = this.repository.updateTask(idTask, taskUpdated);
    return taskUpdate;
  }
}

export default TaskService;
