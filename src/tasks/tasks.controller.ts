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
import { Result } from "../utils/utils";
import HttpException from "../exceptions/HttpException";
import EmailService from "../mail/email.service";
import { authMiddleware, decodedToken } from "../middlewares/auth.middleware";

class TasksController implements Controller {
  public path = "/tasks";
  public router = express.Router();
  private taskService = new TaskService(
    new PostgresTaskRepository(),
    new ProjectService(
      new PostgresProjectRepository(),
      new UserService(new PostgresUserRepository()),
      new EmailService()
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
    this.router.put(
      `${this.path}/:id/responsible`,
      authMiddleware,
      this.assignedTo
    );
    this.router.put(`${this.path}/:id/responsible`, this.unassigned);
  }

  private unassigned = async (
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
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const user: assignToDto = request.body;
      const myCookie = request.cookies["Authorization"];
      const idUser = decodedToken(myCookie);
      await this.taskService.assignTo(Number(id), user, Number(idUser));
      response.status(200).send(new Result(true, "", null));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private getTaskById = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const task = await this.taskService.findTaskById(Number(id));
      response.status(200).send(new Result(true, "", task));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private createTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const task: CreateTaskDto = request.body;
      const newTask = await this.taskService.createTask(task);
      response.status(201).send(new Result(true, "", newTask));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private modifyTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const taskUpdate: updateTaskDto = request.body;
      const taskUpdated = await this.taskService.updateTask(
        Number(id),
        taskUpdate
      );
      response.status(201).send(new Result(true, "", taskUpdated));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private deleteTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      await this.taskService.deleteTask(Number(id));
      response
        .status(200)
        .send(new Result(true, `Task with id ${id} has delete`, null));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private getAllTasksByProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.query.id;
      const allTasks = await this.taskService.findAllTasksByProject(Number(id));
      response.status(200).send(new Result(true, "", allTasks));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };
}

export default TasksController;
