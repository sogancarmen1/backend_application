import ProjectService from "projects/project.service";
import ITaskRepository from "./taskRepository.interface";
import TaskNotFoundException from "../exceptions/TaskNotFoundException";
import TasksNotFoundInProject from "../exceptions/TasksNotFoundInProject";
import TaskAlreadyExistException from "../exceptions/TaskAlreadyExistExceptions";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";
import UserService from "users/user.service";
import TaskNotFoundByIdInProject from "../exceptions/TaskNotFoundInProject";
import TaskIsNotAssigned from "../exceptions/TaskIsNotAssigned";
import User from "users/user.interface";
import EmailService from "mail/email.service";

class TaskService {
  repository: ITaskRepository;
  projectService: ProjectService;
  userService: UserService;
  emailService: EmailService;
  constructor(
    repository: ITaskRepository,
    projectService: ProjectService,
    userService: UserService,
    emailService: EmailService
  ) {
    this.repository = repository;
    this.projectService = projectService;
    this.userService = userService;
    this.emailService = emailService;
  }

  public async findTaskByIdInProject(idTask: Number, idProject: Number) {
    const task = await this.repository.getTaskByIdInProject(idTask, idProject);
    if (task == null) throw new TaskNotFoundByIdInProject(idTask, idProject);
    return task;
  }

  public async assignTo(idTask: Number, user: assignToDto) {
    const userFound: User = await this.userService.findUserByEmail(
      user.userEmail
    );
    await this.projectService.findProjectById(user.idProject);
    const task = await this.findTaskById(idTask);
    await this.findTaskByIdInProject(idTask, user.idProject);
    await this.projectService.findMemberById(user.idProject, userFound.id);
    const value = await this.repository.assignTo(idTask, user, userFound.email);
    await this.emailService.sendMail(
      [user.userEmail],
      "Bienvenue sur la plateforme ProAt!",
      `La tâche "${task.name}" vous a été assignée. \nConnectez-vous pour consulter cette derniere : https://front-end-to-do-list-niul.vercel.app/`,
      `La tâche "${task.name}" vous a été assignée. \nConnectez-vous pour consulter cette derniere : https://front-end-to-do-list-niul.vercel.app/`
    );
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
    const taskUpdate = this.repository.updateTask(idTask, {
      ...task,
      ...taskUpdated,
    });
    return taskUpdate;
  }
}

export default TaskService;
