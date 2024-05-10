import { Pool } from "pg";
import ITaskRepository from "./taskRepository.interface";
import Task from "./tasks.interface";
import { CreateTaskDto, updateTaskDto } from "./tasks.dto";

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
      taskName: row.taskname,
      dueDate: row.duedate,
      priority: row.priority,
      status: row.status,
      projectId: row.id_projects,
    };
    return task;
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
        "INSERT INTO tasks (id_projects, taskname, priority, duedate, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          task.projectId,
          task.taskName,
          task.priority,
          task.dueDate,
          task.status,
        ]
      );
      return this.convertRowToTask(result.rows[0]);
    } catch (error) {}
  }

  async updateTask(taskId: Number, task: updateTaskDto): Promise<Task> {
    try {
      const result = await this.pool.query(
        "UPDATE tasks SET taskname = $1, priority = $2, status = $3, duedate = $4 WHERE id = $5 RETURNING * ",
        [task.taskName, task.priority, task.status, task.dueDate, taskId]
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
      `SELECT * FROM tasks WHERE taskname = $1 AND id_projects = $2`,
      [taskName, projectId]
    );
    if (isTaskExist.rowCount == 0) return false;
    return true;
  }
}

export default PostgresTaskRepository;
