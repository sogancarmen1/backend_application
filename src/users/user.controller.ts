import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import { authMiddleware } from "../middlewares/auth.middleware";
import UserService from "./user.service";
import PostgresUserRepository from "./postgresUser.repository";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private userService = new UserService(new PostgresUserRepository());

  constructor() {
    this.initializeRoute();
  }

  public initializeRoute() {
    //Gerer les autorisations
    // this.router.get(this.path, authMiddleware, this.getAllUsers);
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
  }

  private getUserById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const user = await this.userService.findUserById(Number(id));
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private getAllUsers = async (
    request: express.Request,
    response: express.Response
  ) => {
    const value = await this.userService.findAllUsers();
    response.send(value);
  };
}

export default UserController;
