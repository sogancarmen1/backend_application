import express from "express";
import Controller from "interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";
import TaskService from "./task.service";
import PostgresTaskRepository from "./postgresTask.repository";
import ProjectService from "../projects/project.service";
import PostgresProjectRepository from "../projects/postgresProject.repository";
import UserService from "../users/user.service";
import PostgresUserRepository from "../users/postgresUser.repository";

class TasksController implements Controller {
  public path = "/tasks";
  public router = express.Router();
  private taskService = new TaskService(
    new PostgresTaskRepository(),
    new ProjectService(
      new PostgresProjectRepository(),
      new UserService(new PostgresUserRepository())
    ),
    new UserService(new PostgresUserRepository())
  );

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(CreateTaskDto),
      this.createTaskInProject
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateTaskDto, true),
      this.modifyTaskInProject
    );
    this.router.delete(`${this.path}/:id`, this.deleteTaskInProject);
    this.router.get(this.path, this.getAllTasksByProject);
    this.router.get(`${this.path}/:id`, this.getTaskById);
    this.router.post(`${this.path}/:id/assignment`, this.assignedTo);
    this.router.put(`${this.path}/:id/assignment`, this.referTo);
  }

  private referTo = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const id1 = request.query.id1;
      await this.taskService.referTo(Number(id1), Number(id));
      response.send(`Task with id ${id} is unassigned`);
    } catch (error) {
      next(error);
    }
  };

  private assignedTo = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const idProject = request.query.idProject;
      const user: assignToDto = request.body;
      await this.taskService.assignTo(
        Number(idProject.toString()),
        Number(id),
        user
      );
      response.send(
        `User with id ${user.id} has assigned to task with id ${id}`
      );
    } catch (error) {
      next(error);
    }
  };

  private getTaskById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const task = await this.taskService.findTaskById(Number(id));
      response.send(task);
    } catch (error) {
      next(error);
    }
  };

  private createTaskInProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const task: CreateTaskDto = request.body;
      const newTask = await this.taskService.createTask(task);
      response.send(newTask);
    } catch (error) {
      next(error);
    }
  };

  private modifyTaskInProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const taskUpdate: updateTaskDto = request.body;
      const taskUpdated = await this.taskService.updateTask(
        Number(id),
        taskUpdate
      );
      response.send(taskUpdated);
    } catch (error) {
      next(error);
    }
  };

  private deleteTaskInProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      await this.taskService.deleteTask(Number(id));
      response.send(`Task with id ${id} has delete`);
    } catch (error) {
      next(error);
    }
  };

  private getAllTasksByProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.query.id;
      const allTasks = await this.taskService.findAllTasksByProject(Number(id));
      response.send(allTasks);
    } catch (error) {
      next(error);
    }
  };
}

export default TasksController;
