import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import PostgresProjectRepository from "./postgresProject.repository";
import ProjectService from "./project.service";
import PostgresUserRepository from "../users/postgresUser.repository";
import UserService from "../users/user.service";
import Members from "members/members.interface";
import AddMemberDto from "members/member.dto";

class ProjectsController implements Controller {
  public path = "/projects";
  public router = express.Router();
  private projectService = new ProjectService(
    new PostgresProjectRepository(),
    new UserService(new PostgresUserRepository())
  );
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
    this.router.post(`${this.path}/:id/members`, this.addMembers);
    this.router.get(`${this.path}/:id/member`, this.getMemberById);
    this.router.delete(`${this.path}/:id/members`, this.removeMembers);
    this.router.get(`${this.path}/:id/members`, this.getAllMembers);
  }

  private getAllMembers = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const members: Members[] = await this.projectService.findAllMembers(
        Number(id)
      );
      response.send(members);
    } catch (error) {
      next(error);
    }
  };

  private removeMembers = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const usersId = request.query.usersId;
      const myTab = [];
      for (let i = 0; i < Number(usersId.length.toString()); i++) {
        myTab.push(usersId[i]);
      }
      await this.projectService.removeMembers(myTab, Number(id));
      response.send(
        `Users with id ${usersId} has remove from project with id ${id}`
      );
    } catch (error) {
      next(error);
    }
  };

  private getMemberById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const idUser = request.params.id;
      const idProject = request.query.idProject;
      const member: Members = await this.projectService.findMemberById(
        Number(idProject),
        Number(idUser)
      );
      response.send(member);
    } catch (error) {
      next(error);
    }
  };

  private addMembers = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const members: AddMemberDto[] = request.body;
      const membersAdded = await this.projectService.addMembers(
        members,
        Number(id)
      );
      response.send(membersAdded);
    } catch (error) {
      next(error);
    }
  };

  private getAllProjects = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.query.id;
      const allProjects = await this.projectService.findAllProjectsForUser(
        Number(id)
      );
      response.send(allProjects);
    } catch (error) {
      next(error);
    }
  };

  private createProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const project: CreateProjectDto = request.body;
      const newProject = await this.projectService.createProject(project);
      response.send(newProject);
    } catch (error) {
      next(error);
    }
  };

  private modifyProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const newProject: UpdateProjectDto = request.body;
    try {
      const projectUpdated = await this.projectService.updateProject(
        Number(id),
        newProject
      );
      response.send(projectUpdated);
    } catch (error) {
      next(error);
    }
  };

  private deleteProject = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    try {
      await this.projectService.deleteProject(Number(id));
      response.send(`Project with id ${id} has delete`);
    } catch (error) {
      next(error);
    }
  };

  private getProjectById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const projectFound = await this.projectService.findProjectById(
        Number(id)
      );
      response.send(projectFound);
    } catch (error) {
      next(error);
    }
  };
}

export default ProjectsController;
