import AddMemberDto from "members/member.dto";
import Members from "members/members.interface";
import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProjects(idUser: Number): Promise<Project[] | []>;
  getProjectById(idProject: Number): Promise<Project | null>;
  getProjectByName(name: String): Promise<Project | null>;
  isProjectByNameExistForUser(
    projectName: string,
    idUser: Number
  ): Promise<boolean>;
  updateProject(idProject: Number, project: UpdateProjectDto): Promise<Project>;
  deleteProject(idProject: Number): Promise<void>;
  createProject(project: CreateProjectDto): Promise<Project>;
  addMembers(members: string): Promise<any[]>;
  getAllMembers(idProject: Number): Promise<Members[] | []>;
  deleteProjectWithAllMembers(idProject: Number): Promise<void>;
  getMemberById(idProject: Number, idUser: Number): Promise<Members>;
  removeMembers(membersId: string, idProject: Number): Promise<void>;
}

export default IProjectRepository;
