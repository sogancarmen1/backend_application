import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import Project from "./projects.interface";
import TasksController from "../tasks/tasks.controller";
import Task from "../tasks/tasks.interface";

class ProjectsController implements Controller {
  public path = "/projects";
  public router = express.Router();
  public task: TasksController;

  private projects: Project[] = [
    {
      id: 1,
      projectName: "Nom du projet",
    },
  ];

  constructor(controllers: TasksController) {
    this.task = controllers;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProjects);
    this.router.post(this.path, this.createProject);
    this.router.put(`${this.path}/:id`, this.modifyProject);
    this.router.delete(`${this.path}/:id`, this.deleteProject);
    this.router.get(`${this.path}/:id`, this.getProjectById);
    this.router.get(
      `${this.path}/:id${this.task.path}`,
      this.getAllTaskInProject
    );
    this.router.delete(
      `${this.path}/:id${this.task.path}/:id1`,
      this.deleteTaskInProject
    );
    this.router.put(
      `${this.path}/:id${this.task.path}/:id1`,
      this.updateTaskProject
    );
    this.router.post(
      `${this.path}/:id${this.task.path}`,
      this.createTaskInProject
    );
  }

  private createTaskInProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const newTask: Task = request.body;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    if (index != -1) {
      this.task.tasks.push(newTask);
      response.send(newTask);
    }
  };

  private updateTaskProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const id1 = request.params.id1;
    const newTask: Task = request.body;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    const index1 = this.task.tasks.findIndex((task) => task.id === Number(id1));
    if (index != -1) {
      if (index1 != -1) {
        if (this.projects[index].id === this.task.tasks[index1].idProject) {
          this.task.tasks[index1].taskName = newTask.taskName;
          this.task.tasks[index1].dueDate = newTask.dueDate;
          this.task.tasks[index1].priority = newTask.priority;
          this.task.tasks[index1].status = newTask.status;
          this.task.tasks[index1].idProject = this.projects[index].id;
          response.send(newTask);
        }
      }
    }
  };

  private deleteTaskInProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const id1 = request.params.id1;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    const index1 = this.task.tasks.findIndex((task) => task.id === Number(id1));
    if (index != -1) {
      if (index1 != -1) {
        if (this.projects[index].id === this.task.tasks[index1].idProject) {
          response.send(
            `La tâche ${this.task.tasks[index1].taskName} se trouvant dans le projet ${this.projects[index].projectName} à été supprimée!`
          );
          this.task.tasks.splice(index1, 1);
        }
      }
    }
  };

  private getAllTaskInProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const tasks: Task[] = [];
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    if (index != -1) {
      this.task.tasks.forEach((task) => {
        if (task.idProject === Number(id)) {
          tasks.push(task);
        }
      });
    }
    response.send(tasks);
  };

  private getAllProjects = (
    request: express.Request,
    response: express.Response
  ) => {
    response.send(this.projects);
  };

  private createProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const project = request.body;
    this.projects.push(project);
    response.send(project);
  };

  private modifyProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const newProject: Project = request.body;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    if (index != -1) {
      this.projects[index].id = newProject.id;
      this.projects[index].projectName = newProject.projectName;
    }
    response.send(newProject);
  };

  private deleteProject = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    if (index != -1) {
      response.send(
        `La tâche "${this.projects[index].projectName}" à été supprimée avec succès!`
      );
      this.projects.splice(index, 1);
    }
  };

  private getProjectById = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    response.send(this.projects[index].projectName);
  };
}

export default ProjectsController;
