import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import UserService from "./user.service";
import PostgresUserRepository from "./postgresUser.repository";
import { authMiddleware, decodedToken } from "../middlewares/auth.middleware";
import { Result } from "../utils/utils";
import HttpException from "../exceptions/HttpException";

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
    this.router.get(this.path, this.getUserById);
    this.router.get(
      `${this.path}/email-contains`,
      authMiddleware,
      this.getAllUsersWithEmailContainCaractere
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      this.getUserByIdForUserConnected
    );
  }

  private getAllUsersWithEmailContainCaractere = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const search = request.query.search;
      const users =
        await this.userService.findAllUsersWithEmailContainCharactere(
          String(search)
        );
      response.status(200).send(new Result(true, "", users));
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

  private getUserByIdForUserConnected = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const user = await this.userService.findUserById(Number(id));
      response.status(200).send(
        new Result(true, "", {
          email: user.email,
        })
      );
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

  // private getAllUsers = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   const value = await this.userService.findAllUsers();
  //   response.send(value);
  // };
}

export default UserController;
