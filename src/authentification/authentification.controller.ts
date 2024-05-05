import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import { CreateUserDto } from "../users/user.dto";
import { LoginDto } from "../users/user.dto";
import validationMiddleware from "../middlewares/validation.middleware";
import AuthentificationService from "./authentification.service";
import PostgresUserRepository from "../users/postgresUser.repository";
import UserService from "../users/user.service";

class AuthentificationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private authentificationService = new AuthentificationService(
    new UserService(new PostgresUserRepository())
  );

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.logginIn
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userData: CreateUserDto = request.body;
      await this.authentificationService.register(userData);
      response.send("you are registered");
    } catch (error) {
      next(error);
    }
  };

  private logginIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const logInData: LoginDto = request.body;
      const cookie = await this.authentificationService.loggin(logInData);
      response.setHeader("Set-Cookie", [cookie]);
      response.send("you are connected");
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
}

export default AuthentificationController;
