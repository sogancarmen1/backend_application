import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import IProjectRepository from "./iProject.repository";
import ProjectNotFoundUser from "../exceptions/ProjectNotFoundFroUser";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import UserService from "../users/user.service";
import ProjectAlreadyExistException from "../exceptions/ProjectAlreadyExistException";

class ProjectService {
  repository: IProjectRepository;
  userService: UserService;
  constructor(repository: IProjectRepository, userService: UserService) {
    this.repository = repository;
    this.userService = userService;
  }

  public async findAllProject(idUser: string) {
    await this.userService.findUserById(idUser);
    const allProjects = await this.repository.getAllProject(Number(idUser));
    if (allProjects.length == 0) throw new ProjectNotFoundUser(idUser);
    return allProjects;
  }

  public async findProjectById(idProject: Number) {
    const projectById = await this.repository.getProjectById(idProject);
    if (projectById == null)
      throw new ProjectNotFoundException(String(idProject));
    return projectById;
  }

  public async deleteProject(idProject: Number) {
    const project = await this.repository.deleteProject(idProject);
    if (project == null) {
      throw new ProjectNotFoundException(String(idProject));
    }
    return project;
  }

  public async createProject(project: CreateProjectDto) {
    await this.userService.findUserById(String(project.userId));
    const result = await this.repository.createProject(project);
    if (result != "") {
      throw new ProjectAlreadyExistException(project.projectName);
    }
  }

  public async updateProject(
    idProject: Number,
    projectUpdated: UpdateProjectDto
  ) {
    const value = await this.repository.updateProject(
      idProject,
      projectUpdated
    );
    if (value == null) {
      throw new ProjectNotFoundException(String(idProject));
    }
    if (typeof value == "string") {
      throw new ProjectAlreadyExistException(projectUpdated.projectName);
    }
    return value;
  }
}

export default ProjectService;
