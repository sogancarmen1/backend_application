import IUserRepository from "./iUser.repository";
import { Pool } from "pg";
import User from "./user.interface";
import "dotenv/config";
import { CreateUserDto } from "./user.dto";

class PostgresUserRepository implements IUserRepository {
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

  private convertRowToUser(row: any) {
    const userFound: User = {
      id: row.id,
      firstName: row.firstname,
      lastName: row.lastname,
      email: row.email,
      password: row.password,
    };
    return userFound;
  }

  //firstName est un attribut de l'interface User
  //firstname est le nom d'une colonne de la table users dans la BD
  async getAllUser(): Promise<User[]> {
    try {
      const result = await this.pool.query("SELECT * FROM users");
      const usersFound: User[] = result.rows.map((row) => {
        return this.convertRowToUser(row);
      });
      return usersFound;
    } catch (error) {}
  }

  async getUserById(userId: Number): Promise<User | null> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rows[0] == undefined) {
        return null;
      }
      return this.convertRowToUser(result.rows[0]);
    } catch (error) {}
  }

  async getUserByEmail(userEmail: string): Promise<User> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [userEmail]
      );
      return this.convertRowToUser(result.rows[0]);
    } catch (error) {}
  }

  async createUser(user: CreateUserDto, hashedPassword: string): Promise<null> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [user.email]
      );
      if (result.rowCount > 0) return null;
      await this.pool.query(
        `INSERT INTO users (firstname, email, lastname, password) VALUES ($1, $2, $3, $4)`,
        [user.firstName, user.email, user.lastName, hashedPassword]
      );
    } catch (error) {}
  }
}

export default PostgresUserRepository;
