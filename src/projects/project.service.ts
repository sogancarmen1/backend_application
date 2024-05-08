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

  public async findAllProjectsForUser(idUser: Number) {
    await this.userService.findUserById(idUser);
    const allProjects = await this.repository.getAllProjectForUser(idUser);
    if (allProjects.length == 0) throw new ProjectNotFoundUser(idUser);
    return allProjects;
  }

  public async findProjectByIdForUser(idProject: Number) {
    const projectById = await this.repository.getProjectByIdForUser(idProject);
    if (projectById == null)
      throw new ProjectNotFoundException(String(idProject));
    return projectById;
  }

  public async findProjectByNameForUser(projectName: string) {
    const projectExist = await this.repository.getProjectByNameForUser(
      projectName
    );
    if (projectExist == true)
      throw new ProjectAlreadyExistException(projectName);
  }

  public async deleteProject(idProject: Number) {
    await this.findProjectByIdForUser(idProject);
    await this.repository.deleteProject(idProject);
  }

  public async createProject(project: CreateProjectDto) {
    await this.userService.findUserById(project.userId);
    const result = await this.repository.createProject(project);
    if (result != "") {
      throw new ProjectAlreadyExistException(project.projectName);
    }
  }

  public async updateProject(
    idProject: Number,
    projectUpdated: UpdateProjectDto
  ) {
    await this.findProjectByIdForUser(idProject);
    await this.findProjectByNameForUser(projectUpdated.projectName);
    await this.repository.updateProject(idProject, projectUpdated);
    const projectUpdate = this.findProjectByIdForUser(idProject);
    return projectUpdate;
  }
}

export default ProjectService;
