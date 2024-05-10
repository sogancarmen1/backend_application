import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import IProjectRepository from "./projectRepository.interface";
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
    if (projectById == null) throw new ProjectNotFoundException(idProject);
    return projectById;
  }

  public async checkIfProjectNameAlreadyExistsForUser(
    projectName: string,
    idUser: Number
  ) {
    const projectExist = await this.repository.isProjectByNameExistForUser(
      projectName,
      idUser
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
    await this.checkIfProjectNameAlreadyExistsForUser(
      project.projectName,
      project.userId
    );
    const result = await this.repository.createProject(project);
    return result;
  }

  public async updateProject(
    idProject: Number,
    projectUpdated: UpdateProjectDto
  ) {
    const project = await this.findProjectByIdForUser(idProject);
    await this.checkIfProjectNameAlreadyExistsForUser(
      projectUpdated.projectName,
      project.userId
    );
    const projectUpdate = await this.repository.updateProject(
      idProject,
      projectUpdated
    );
    return projectUpdate;
  }
}

export default ProjectService;
