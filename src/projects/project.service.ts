import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import IProjectRepository from "./projectRepository.interface";
import ProjectNotFoundUser from "../exceptions/ProjectNotFoundFroUser";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import UserService from "../users/user.service";
import ProjectAlreadyExistException from "../exceptions/ProjectAlreadyExistException";
import AddMemberDto from "members/member.dto";
import Members from "members/members.interface";
import UserIsAlreadyInProjectException from "../exceptions/UserIsAlreadyInProjectException";
import UserNotFoundInProjectException from "../exceptions/UserNotFoundInProjectException";

class ProjectService {
  repository: IProjectRepository;
  userService: UserService;
  constructor(repository: IProjectRepository, userService: UserService) {
    this.repository = repository;
    this.userService = userService;
  }

  public async findAllProjectsForUser(idUser: Number) {
    await this.userService.findUserById(idUser);
    const allProjects = await this.repository.getAllProjects(idUser);
    if (allProjects.length == 0) throw new ProjectNotFoundUser(idUser);
    return allProjects;
  }

  public async findProjectById(idProject: Number) {
    const projectById = await this.repository.getProjectById(idProject);
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
    await this.deleteProjectWithAllMembers(idProject);
    await this.repository.deleteProject(idProject);
  }

  private convertAddMemberDtoToString(
    addMemberDto: AddMemberDto[],
    idProject: Number
  ) {
    return addMemberDto
      .map((member) => `(${member.idUser}, ${idProject}, '${member.roleType}')`)
      .join(", ");
  }

  public async addMembers(members: AddMemberDto[], idProject: Number) {
    for (const member of members) {
      await this.userService.findUserById(member.idUser);
      await this.findProjectById(idProject);
      const result = await this.repository.getMemberById(
        idProject,
        member.idUser
      );
      if (result) {
        throw new UserIsAlreadyInProjectException(member.idUser, idProject);
      }
    }
    const addedMember = await this.repository.addMembers(
      this.convertAddMemberDtoToString(members, idProject)
    );
    return addedMember;
  }

  public async findMemberById(idProject: Number, idUser: Number) {
    await this.findProjectById(idProject);
    await this.userService.findUserById(idUser);
    const member = await this.repository.getMemberById(idProject, idUser);
    if (member == null)
      throw new UserNotFoundInProjectException(idUser, idProject);
    return member;
  }

  public async removeMembers(membersId: string[], idProject: Number) {
    for (const id of membersId) {
      await this.findMemberById(idProject, Number(id));
    }
    const idOfMembers = membersId
      .map((idMember) => `${Number(idMember)}`)
      .join(", ");
    await this.repository.removeMembers(`(${idOfMembers})`, idProject);
  }

  public async deleteProjectWithAllMembers(idProject: Number) {
    await this.findProjectById(idProject);
    await this.repository.deleteProjectWithAllMembers(idProject);
  }

  public async createProject(project: CreateProjectDto) {
    const projectFoundByName = await this.repository.getProjectByName(
      project.name
    );
    await this.checkIfProjectNameAlreadyExistsForUser(
      project.name,
      project.userId
    );
    const result = await this.repository.createProject(project);
    await this.addMembers(
      [{ idUser: project.userId, roleType: "owner" }],
      projectFoundByName.id
    );
    return result;
  }

  public async findAllMembers(idProject: Number) {
    await this.findProjectById(idProject);
    const members = await this.repository.getAllMembers(idProject);
    return members;
  }

  public async updateProject(
    idProject: Number,
    projectUpdated: UpdateProjectDto
  ) {
    const allMembers: Members[] = await this.findAllMembers(idProject);
    const member = allMembers.find((member) => {
      return member.roleType === "owner";
    });
    await this.checkIfProjectNameAlreadyExistsForUser(
      projectUpdated.name,
      member.id
    );
    const projectUpdate = await this.repository.updateProject(
      idProject,
      projectUpdated
    );
    return projectUpdate;
  }
}

export default ProjectService;
