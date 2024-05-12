import AddMemberDto from "members/member.dto";
import Members from "members/members.interface";
import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProjectForUser(idUser: Number): Promise<Project[] | []>;
  getProjectByIdForUser(idProject: Number): Promise<Project | null>;
  isProjectByNameExistForUser(
    projectName: string,
    idUser: Number
  ): Promise<boolean>;
  updateProject(idProject: Number, project: UpdateProjectDto): Promise<Project>;
  deleteProject(idProject: Number): Promise<void>;
  createProject(project: CreateProjectDto): Promise<Project>;
  addMember(member: AddMemberDto[]): Promise<any[]>;
  getAllMembers(idProject: Number): Promise<Members[] | []>;
  deleteProjectWithAllMember(idProject: Number): Promise<void>;
  getMemberById(idProject: Number, idUser: Number): Promise<Members>;
  removeMember(idProject: Number, idUser: Number): Promise<void>;
}

export default IProjectRepository;
