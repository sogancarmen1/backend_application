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
      name: row.name,
      description: row.description,
    };
    return project;
  }

  private convertRowToMember(row: any) {
    const member: Members = {
      id: row.id,
      email: row.email,
      roleType: row.role_type,
    };
    return member;
  }

  async getMemberById(idProject: Number, idUser: Number): Promise<Members> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM users JOIN members ON users.id = members.id_users WHERE members.id_users = $1 AND members.id_projects = $2",
        [idUser, idProject]
      );
      const member: Members = this.convertRowToMember(result.rows[0]);
      return member;
    } catch (error) {}
  }

  async removeMembers(membersId: string, idProject: Number): Promise<void> {
    try {
      await this.pool.query(
        "DELETE FROM members WHERE id_users IN " +
          membersId +
          " AND id_projects = $1",
        [idProject]
      );
    } catch (error) {}
  }

  async addMembers(members: string): Promise<Members[]> {
    try {
      const result = await this.pool.query(
        "INSERT INTO members(id_users, id_projects, role_type) VALUES " +
          members +
          " RETURNING *"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllMembers(idProject: Number): Promise<Members[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM users JOIN members ON users.id = members.id_users WHERE members.id_projects = $1",
        [idProject]
      );
      const members: Members[] = result.rows.map((member) => {
        return this.convertRowToMember(member);
      });
      return members;
    } catch (error) {}
  }

  async getAllProjects(idUser: Number): Promise<Project[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM projects JOIN members ON projects.id = members.id_projects WHERE members.id_users = $1",
        [idUser]
      );
      if (result.rowCount == 0) return [];
      const projects: Project[] = result.rows.map((project) => {
        return this.convertRowToProject(project);
      });
      return projects;
    } catch (error) {}
  }

  async getProjectById(idProject: Number): Promise<Project | null> {
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
      `SELECT * FROM projects JOIN members ON projects.id = members.id_projects WHERE projects.name = $1 AND members.id_users = $2`,
      [projectName, idUser]
    );
    if (isProjectExist.rowCount == 0) return false;
    return true;
  }

  async getProjectByName(name: String): Promise<Project | null> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM projects WHERE name = $1",
        [name]
      );
      if (result.rowCount == 0) return null;
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    try {
      //Faire une transaction
      const result = await this.pool.query(
        "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
        [project.name, project.description]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProjectWithAllMembers(idProject: Number): Promise<void> {
    try {
      //Faire une transaction
      await this.pool.query(
        "DELETE FROM members WHERE id_projects = $1",
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
        [project.name, project.description, idProject]
      );
      return this.convertRowToProject(result.rows[0]);
    } catch (error) {}
  }
}

export default PostgresProjectRepository;
