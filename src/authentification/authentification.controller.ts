import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import { CreateUserDto } from "../users/user.dto";
import { LoginDto } from "../users/user.dto";
import validationMiddleware from "../middlewares/validation.middleware";
import AuthentificationService from "./authentification.service";
import PostgresUserRepository from "../users/postgresUser.repository";
import UserService from "../users/user.service";
import { Result } from "../utils/utils";
import HttpException from "../exceptions/HttpException";
import { authMiddleware } from "middlewares/auth.middleware";

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
    response: express.Response
  ) => {
    try {
      const userData: CreateUserDto = request.body;
      await this.authentificationService.register(userData);
      response.status(201).send(new Result(true, "you are registered", null));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
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
      response.send({ message: "you are connected", data: cookie });
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", [
      "Authorization=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict",
    ]);
    response.sendStatus(200);
  };
}

export default AuthentificationController;
