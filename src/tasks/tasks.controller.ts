import express from "express";
import Controller from "interfaces/controller.interface";
import Task from "./tasks.interface";
import TaskNotFoundException from "../exceptions/TaskNotFoundException";
import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import validationMiddleware from "../middlewares/validation.middleware";
import { CreateTaskDto, updateTaskDto } from "./tasks.dto";

class TasksController implements Controller {
  public path = "/tasks";
  public router = express.Router();

  public tasks: Task[] = [
    {
      id: 1,
      taskName: "Le nom de la tâche",
      dueDate: "12/02/2021",
      priority: "High",
      status: "in_progess",
      projectId: 1,
    },
    {
      id: 2,
      taskName: "Le nom de la tâche 2",
      dueDate: "14/08/2000",
      priority: "Low",
      status: "todo",
      projectId: 1,
    },
    {
      id: 3,
      taskName: "Le nom de la tâche 28",
      dueDate: "20/12/2023",
      priority: "Average",
      status: "done",
      projectId: 2,
    },
  ];

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
    this.router.get(this.path, this.getTaskByProject);
    this.router.get(`${this.path}/:id`, this.getTaskById);
  }

  private getTaskById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      response.send(this.tasks[index]);
    } else next(new TaskNotFoundException(id));
  };

  private createTaskInProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const task: CreateTaskDto = request.body;
    this.tasks.push({ id: 12, ...task });
    response.send(task);
  };

  private modifyTaskInProject = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const newTask: updateTaskDto = request.body;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      this.tasks[index].taskName = newTask.taskName;
      this.tasks[index].dueDate = newTask.dueDate;
      this.tasks[index].priority = newTask.priority;
      this.tasks[index].status = newTask.status;
      response.send(newTask);
    } else next(new TaskNotFoundException(id));
  };

  private deleteTaskInProject = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      response.send(`La tâche "${this.tasks[index].taskName}" à été supprimé!`);
      this.tasks.splice(index, 1);
    } else next(new TaskNotFoundException(id));
  };

  private getTaskByProject = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.query.id;
    const newTask: Task[] = [];
    this.tasks.forEach((task) => {
      if (task.projectId === Number(id)) {
        newTask.push(task);
      }
    });
    if (newTask.length > 0) response.send(newTask);
    //Revoir comment écrire l'erreur ici
    else next(new TaskNotFoundException(String(id)));
  };
}

export default TasksController;
