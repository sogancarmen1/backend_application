import { Pool } from "pg";
import ITaskRepository from "./taskRepository.interface";
import Task from "./tasks.interface";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";

class PostgresTaskRepository implements ITaskRepository {
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

  private convertRowToTask(row: any) {
    const task: Task = {
      id: row.id,
      name: row.name,
      dueDate: row.due_date,
      priority: row.priority,
      status: row.status,
      assignedTo: row.assigned_to,
      projectId: row.id_projects,
      taskDescription: row.description,
    };
    return task;
  }

  async isAssignedTo(idTask: Number, idProject: Number): Promise<boolean> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM tasks WHERE id = $1 AND id_projects = $2 AND assigned_to IS NOT NULL",
        [idTask, idProject]
      );
      if (result.rowCount == 0) return false;
      return true;
    } catch (error) {}
  }

  async getTaskByIdInProject(
    idTask: Number,
    idProject: Number
  ): Promise<Task | null> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM tasks WHERE id = $1 AND id_projects = $2",
        [idTask, idProject]
      );
      if (result.rowCount == 0) return null;
      const task: Task = this.convertRowToTask(result.rows[0]);
      return task;
    } catch (error) {}
  }

  async assignTo(
    idProject: Number,
    idTask: Number,
    user: assignToDto
  ): Promise<Task | null> {
    try {
      const result = await this.pool.query(
        "UPDATE tasks SET assigned_to = $1 WHERE id_projects = $2 AND id = $3 RETURNING * ",
        [user.id, idProject, idTask]
      );
      const value: Task = this.convertRowToTask(result.rows[0]);
      return value;
    } catch (error) {}
  }

  async referTo(idProject: Number, taskId: Number): Promise<void> {
    try {
      await this.pool.query(
        "UPDATE tasks SET assigned_to = NULL WHERE id_projects = $1 AND id = $2",
        [idProject, taskId]
      );
    } catch (error) {}
  }

  async getAllTasksByProject(projectId: Number): Promise<Task[] | []> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM tasks WHERE id_projects = $1",
        [projectId]
      );
      if (result.rowCount == 0) return [];
      const tasks: Task[] = result.rows.map((task) => {
        return this.convertRowToTask(task);
      });
      return tasks;
    } catch (error) {}
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    try {
      const result = await this.pool.query(
        "INSERT INTO tasks (id_projects, name, priority, due_date, status, assigned_to, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          task.projectId,
          task.name,
          task.priority,
          task.dueDate,
          task.status,
          task.assignedTo,
          task.description,
        ]
      );
      return this.convertRowToTask(result.rows[0]);
    } catch (error) {}
  }

  async updateTask(taskId: Number, task: updateTaskDto): Promise<Task> {
    try {
      const result = await this.pool.query(
        "UPDATE tasks SET name = $1, priority = $2, status = $3, due_date = $4, description = $5 WHERE id = $5 RETURNING * ",
        [
          task.name,
          task.priority,
          task.status,
          task.dueDate,
          task.description,
          taskId,
        ]
      );
      return this.convertRowToTask(result.rows[0]);
    } catch (error) {}
  }

  async deleteTask(taskId: Number): Promise<void> {
    try {
      await this.pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
    } catch (error) {}
  }

  async getTaskById(taskId: Number): Promise<Task | null> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
      );
      if (result.rowCount == 0) return null;
      return this.convertRowToTask(result.rows[0]);
    } catch (error) {}
  }

  async isTaskByNameExist(
    taskName: string,
    projectId: Number
  ): Promise<boolean> {
    const isTaskExist = await this.pool.query(
      `SELECT * FROM tasks WHERE name = $1 AND id_projects = $2`,
      [taskName, projectId]
    );
    if (isTaskExist.rowCount == 0) return false;
    return true;
  }
}

export default PostgresTaskRepository;
