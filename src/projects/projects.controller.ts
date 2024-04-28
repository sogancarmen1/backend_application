import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import Project from "./projects.interface";
import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import validationMiddleware from "../middlewares/validation.middleware";
import {CreateProjectDto, UpdateProjectDto} from "./projects.dto";

class ProjectsController implements Controller {
  public path = "/projects";
  public router = express.Router();

  private projects: Project[] = [
    {
      id: 1,
      projectName: "Nom du projet",
      idUser: 4,
    },
    {
      id: 2,
      projectName: "Nom du projet",
      idUser: 8,
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProjects);
    this.router.post(
      this.path,
      validationMiddleware(CreateProjectDto),
      this.createProject
    );
    //Faire des réglages ici
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(UpdateProjectDto, true),
      this.modifyProject
    );
    this.router.delete(`${this.path}/:id`, this.deleteProject);
    this.router.get(`${this.path}/:id`, this.getProjectById);
  }

  private getAllProjects = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.query.id;
    const allProjects: Project[] = [];
    this.projects.forEach((project) => {
      if (project.idUser === Number(id)) {
        allProjects.push(project);
      }
    });
    if (allProjects.length > 0) response.send(allProjects);
    else next(new ProjectNotFoundException(String(id)));
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
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const newProject: UpdateProjectDto = request.body;
    const index = this.projects.findIndex(
      (project) => project.id === Number(id)
    );
    if (index != -1) {
      this.projects[index].projectName = newProject.projectName;
      response.send(newProject);
    } else {
      next(new ProjectNotFoundException(id));
    }
  };

  private deleteProject = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
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
    } else {
      next(new ProjectNotFoundException(id));
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
