import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProject(idUser: Number): Promise<Project[] | []>;
  getProjectById(idProject: Number): Promise<Project | null>;
  updateProject(
    idProject: Number,
    project: UpdateProjectDto
  ): Promise<Project | any>;
  deleteProject(idProject: Number): Promise<null>;
  createProject(project: CreateProjectDto): Promise<string>;
}

export default IProjectRepository;
