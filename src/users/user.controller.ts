import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import authMiddleware from "../middlewares/auth.middleware";
import UserService from "./userService";
import MemoryUserRepository from "./MemoryUserRepository";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private userService = new UserService(new MemoryUserRepository());

  constructor() {
    this.initializeRoute();
  }

  public initializeRoute() {
    //Gerer les autorisations
    this.router.get(this.path, authMiddleware, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
  }

  private getUserById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const user = await this.userService.get_user_by_id(id);
      response.send(user.firstName);
    } catch (error) {
      next(error);
    }
  };

  private getAllUsers = (
    request: express.Request,
    response: express.Response
  ) => {
    response.send(this.userService.get_all_users());
  };
}

export default UserController;
