import { Pool } from "pg";
import IProjectRepository from "./projectRepository.interface";
import Project from "./projects.interface";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";

class PostgresProjectRepository implements IProjectRepository {
  public pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  private convertRowToProject(row: any) {
    const project: Project = {
      id: row.id,
      projectName: row.projectname,
      userId: row.id_users,
    };
    return project;
  }

  async getAllProjectForUser(idUser: Number): Promise<Project[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM projects WHERE id_users = $1",
        [idUser]
      );
      if (result.rowCount == 0) return [];
      const projects: Project[] = result.rows.map((project) => {
        return this.convertRowToProject(project);
      });
      return projects;
    } catch (error) {}
  }

  async getProjectByIdForUser(idProject: Number): Promise<Project | null> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM projects WHERE id = $1",
        [idProject]
      );
      if (result.rowCount == 0) return null;
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }

  async isProjectByNameExistForUser(
    projectName: string,
    idUser: Number
  ): Promise<boolean> {
    const isProjectExist = await this.pool.query(
      `SELECT * FROM projects WHERE projectname = $1 AND id_users = $2`,
      [projectName, idUser]
    );
    if (isProjectExist.rowCount == 0) return false;
    return true;
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    try {
      const result = await this.pool.query(
        "INSERT INTO projects (id_users, projectname) VALUES ($1, $2) RETURNING *",
        [project.userId, project.projectName]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }

  async deleteProject(idProject: Number): Promise<void> {
    try {
      await this.pool.query("DELETE FROM projects WHERE id = $1", [idProject]);
    } catch (error) {}
  }

  async updateProject(
    idProject: Number,
    project: UpdateProjectDto
  ): Promise<Project> {
    try {
      const result = await this.pool.query(
        "UPDATE projects SET projectname = $1 WHERE id = $2 RETURNING * ",
        [project.projectName, idProject]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }
}

export default PostgresProjectRepository;
