import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import UserService from "./user.service";
import PostgresUserRepository from "./postgresUser.repository";
import { authMiddleware, decodedToken } from "../middlewares/auth.middleware";

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
    // this.router.get(this.path, this.getAllUsers);
    // this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.get(
      this.path,
      authMiddleware,
      this.getAllUsersWithEmailContainCaractere
    );
    this.router.get(this.path, authMiddleware, this.getUserById);
  }

  private getAllUsersWithEmailContainCaractere = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const search = request.query.search;
      const users =
        await this.userService.findAllUsersWithEmailContainCharactere(
          String(search)
        );
      response.send(users);
    } catch (error) {
      next(error);
    }
  };

  private getUserById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const myCookie = request.cookies["Authorization"];
      const id = decodedToken(myCookie);
      const user = await this.userService.findUserById(Number(id));
      response.status(200).send({
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  };

  // private getAllUsers = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   const value = await this.userService.findAllUsers();
  //   response.send(value);
  // };
}

export default UserController;
