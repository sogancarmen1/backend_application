import { CreateProjectDto, UpdateProjectDto } from "projects/projects.dto";
import Project from "projects/projects.interface";

interface IProjectRepository {
  getAllProject(idUser: Number): Project[] | null;
  getProjectById(idProject: Number, idUser: Number): Project | null;
  updateProject(
    idProject: Number,
    idUser: Number,
    project: UpdateProjectDto
  ): Project | null;
  deleteProject(idProject: Number, idUser: Number): string;
  createProject(project: CreateProjectDto): string;
}

export default IProjectRepository;
