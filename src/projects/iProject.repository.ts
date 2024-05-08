import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProjectForUser(idUser: Number): Promise<Project[] | []>;
  getProjectById(idProject: Number): Promise<Project | null>;
  isProjectByNameExistForUser(projectName: string, idUser: Number): Promise<boolean>;
  updateProject(idProject: Number, project: UpdateProjectDto): Promise<Project>;
  deleteProject(idProject: Number): Promise<void>;
  createProject(project: CreateProjectDto): Promise<Project>;
}

export default IProjectRepository;
