import ProjectNotFoundException from "../exceptions/ProjectNotFoundException";
import IProjectRepository from "./projectRepository.interface";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import UserService from "../users/user.service";
import ProjectAlreadyExistException from "../exceptions/ProjectAlreadyExistException";
import { AddMemberDto, MemberConfig } from "members/member.dto";
import Members from "members/members.interface";
import UserIsAlreadyInProjectException from "../exceptions/UserIsAlreadyInProjectException";
import UserNotFoundInProjectException from "../exceptions/UserNotFoundInProjectException";
import EmailService from "mail/email.service";

class ProjectService {
  repository: IProjectRepository;
  userService: UserService;
  emailService: EmailService;
  constructor(
    repository: IProjectRepository,
    userService: UserService,
    emailService: EmailService
  ) {
    this.repository = repository;
    this.userService = userService;
    this.emailService = emailService;
  }

  public async findAllProjectsForUser(idUser: Number) {
    await this.userService.findUserById(idUser);
    const allProjects = await this.repository.getAllProjects(idUser);
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
    await this.findProjectById(idProject);
    await this.repository.deleteProject(idProject);
  }

  public async addMembers(members: AddMemberDto[], idProject: Number) {
    const memberConfig: MemberConfig[] = [];
    for (const member of members) {
      const user = await this.userService.findUserByEmail(member.userEmail);
      memberConfig.push({
        idUser: user.id,
        roleType: "user",
      });
      await this.findProjectById(idProject);
      const result = await this.repository.getMemberById(idProject, user.id);
      if (result) {
        throw new UserIsAlreadyInProjectException(user.id, idProject);
      }
    }
    if (memberConfig.length == members.length) {
      const addedMember = await this.repository.addMembers(
        memberConfig,
        idProject
      );
      const member: string[] = members.map((member) => member.userEmail);
      await this.emailService.sendMail(
        member,
        "Bienvenue sur la plateforme ProAt!",
        `Vous avez été ajouté(e) à un projet. \nConnectez-vous pour consulter ce dernier : https://front-end-to-do-list-niul.vercel.app/`,
        `Vous avez été ajouté(e) à un projet. \nConnectez-vous pour consulter ce dernier : https://front-end-to-do-list-niul.vercel.app/`
      );
      return addedMember;
    }
    return [];
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
    await this.repository.removeMembers(membersId, idProject);
  }

  public async createProject(project: CreateProjectDto) {
    await this.userService.findUserById(project.userId);
    await this.checkIfProjectNameAlreadyExistsForUser(
      project.name,
      project.userId
    );
    const result = await this.repository.createProject(project);
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
    const project = await this.findProjectById(idProject);
    const allMembers: Members[] = await this.findAllMembers(idProject);
    const member = allMembers.find((member) => {
      return member.roleType === "owner";
    });
    await this.checkIfProjectNameAlreadyExistsForUser(
      projectUpdated.name,
      member.id
    );
    const projectUpdate = await this.repository.updateProject(idProject, {
      ...project,
      ...projectUpdated,
    });
    return projectUpdate;
  }
}

export default ProjectService;
