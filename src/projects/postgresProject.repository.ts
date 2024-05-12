import { Pool } from "pg";
import IProjectRepository from "./projectRepository.interface";
import Project from "./projects.interface";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import Members from "members/members.interface";
import AddMemberDto from "members/member.dto";

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
      projectName: row.name,
      projectDescription: row.description,
    };
    return project;
  }

  private convertRowToMember(row: any) {
    const member: Members = {
      id: row.id,
      userEmail: row.email,
      roleType: row.role_type,
    };
    return member;
  }

  async getMemberById(idProject: Number, idUser: Number): Promise<Members> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM users JOIN many_users_has_many_projects ON users.id = many_users_has_many_projects.id_users WHERE many_users_has_many_projects.id_users = $1 AND many_users_has_many_projects.id_projects = $2",
        [idUser, idProject]
      );
      const member: Members = this.convertRowToMember(result.rows[0]);
      return member;
    } catch (error) {}
  }

  async removeMember(idProject: Number, idUser: Number): Promise<void> {
    try {
      await this.pool.query(
        "DELETE FROM many_users_has_many_projects WHERE id_users = $1 AND id_projects = $2",
        [idUser, idProject]
      );
    } catch (error) {
      console.log(error);
    }
  }

  async addMember(members: AddMemberDto[]): Promise<Members[]> {
    try {
      const insertionResults = [];
      for (const member of members) {
        const result = await this.pool.query(
          "INSERT INTO many_users_has_many_projects(id_users, id_projects, role_type) VALUES ($1, $2, $3) RETURNING *",
          [member.idUser, member.idProject, member.roleType]
        );
        insertionResults.push(result.rows[0]);
      }
      return insertionResults;
    } catch (error) {}
  }

  async getAllMembers(idProject: Number): Promise<Members[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM users JOIN many_users_has_many_projects ON users.id = many_users_has_many_projects.id_users WHERE many_users_has_many_projects.id_projects = $1",
        [idProject]
      );
      const members: Members[] = result.rows.map((member) => {
        return this.convertRowToMember(member);
      });
      return members;
    } catch (error) {}
  }

  async getAllProjectForUser(idUser: Number): Promise<Project[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM projects JOIN many_users_has_many_projects ON projects.id = many_users_has_many_projects.id_projects WHERE many_users_has_many_projects.id_users = $1",
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
      `SELECT * FROM projects JOIN many_users_has_many_projects ON projects.id = many_users_has_many_projects.id_projects WHERE projects.name = $1 AND many_users_has_many_projects.id_users = $2`,
      [projectName, idUser]
    );
    if (isProjectExist.rowCount == 0) return false;
    return true;
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    try {
      const result = await this.pool.query(
        "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
        [project.projectName, project.description]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }

  async deleteProjectWithAllMember(idProject: Number): Promise<void> {
    try {
      await this.pool.query(
        "DELETE FROM many_users_has_many_projects WHERE id_projects = $1",
        [idProject]
      );
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
        "UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING * ",
        [project.projectName, project.description, idProject]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }
}

export default PostgresProjectRepository;
