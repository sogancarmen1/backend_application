import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProjectForUser(idUser: Number): Promise<Project[] | []>;
  getProjectByIdForUser(idProject: Number): Promise<Project | null>;
  getProjectByNameForUser(projectName: string): Promise<boolean>;
  updateProject(idProject: Number, project: UpdateProjectDto): Promise<void>;
  deleteProject(idProject: Number): Promise<void>;
  createProject(project: CreateProjectDto): Promise<string>;
}

export default IProjectRepository;
