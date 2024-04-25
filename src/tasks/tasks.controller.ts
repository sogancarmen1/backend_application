import express from "express";
import Controller from "interfaces/controller.interface";
import Task from "./tasks.interface";

class TasksController implements Controller {
  public path = "/tasks";
  public router = express.Router();

  public tasks: Task[] = [
    {
      id: 1,
      taskName: "Le nom de la tâche",
      dueDate: new Date(),
      priority: "High",
      status: "in_progess",
      idProject: 1,
    },
    {
      id: 2,
      taskName: "Le nom de la tâche 2",
      dueDate: new Date(),
      priority: "Low",
      status: "todo",
      idProject: 1,
    },
    {
      id: 3,
      taskName: "Le nom de la tâche 28",
      dueDate: new Date(),
      priority: "Average",
      status: "done",
      idProject: 2,
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllTasks);
    this.router.post(this.path, this.createTask);
    this.router.put(`${this.path}/:id`, this.modifyTask);
    this.router.delete(`${this.path}`, this.deleteTask);
    this.router.get(`${this.path}/:id`, this.getTaskById);
  }

  private getAllTasks = (
    request: express.Request,
    response: express.Response
  ) => {
    response.send(this.tasks);
  };

  private createTask = (
    request: express.Request,
    response: express.Response
  ) => {
    const task: Task = request.body;
    this.tasks.push(task);
    response.send(task);
  };

  private modifyTask = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const newTask: Task = request.body;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      this.tasks[index].taskName = newTask.taskName;
      this.tasks[index].dueDate = newTask.dueDate;
      this.tasks[index].priority = newTask.priority;
      this.tasks[index].idProject = newTask.idProject;
      response.send(newTask);
    }
  };

  private deleteTask = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.query.id;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      response.send(`La tâche "${this.tasks[index].taskName}" à été supprimé!`);
      this.tasks.splice(index, 1);
    }
  };

  private getTaskById = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const index = this.tasks.findIndex((task) => task.id === Number(id));
    if (index != -1) {
      response.send(this.tasks[index]);
    }
  };
}

export default TasksController;
