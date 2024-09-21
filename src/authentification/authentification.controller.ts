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
    /**
     * @swagger
     * tags:
     *   - name: Authentification
     *     description: Operations about authentification
     */

    /**
     * @swagger
     * /auth:
     *   post:
     *     tags:
     *       - Authentification
     *     summary: Create a new user
     *     operationId: "registration"
     *     requestBody:
     *       description: Created user object
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUser'
     *     responses:
     *       '201':
     *         description: you are registered
     * components:
     *   schemas:
     *     CreateUser:
     *       type: object
     *       properties:
     *         email:
     *           type: string
     *           example: "myemail@gmail.com"
     *         firstName:
     *           type: string
     *           example: "my_firstName"
     *         lastName:
     *           type: string
     *           example: "my_lastName"
     *         password:
     *           type: string
     *           example: "njhfbrehfbsdh1*"
     *         confirmPassword:
     *           type: string
     *           example: "njhfbrehfbsdh1*"
     *     LoginRequest:
     *        type: object
     *        properties:
     *          email:
     *            type: string
     *            example: "myemail@gmail.com"
     *          password:
     *            type: string
     *            example: "njhfbrehfbsdh1*"
     *     securitySchemes:
     *       cookieAuth:
     *         type: apiKey
     *         in: cookie
     *         name: Authorization
     *
     * security:
     *   - cookieAuth: []
     */
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     tags:
     *       - Authentification
     *     summary: Logs in and returns the authentication  cookie
     *     operationId: "logginIn"
     *     requestBody:
     *       description: A JSON object containing the login and password.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       '200':
     *         description: >
     *           Successfully authenticated.
     *           The session ID is returned in a cookie named `JSESSIONID`. You need to include this cookie in subsequent requests.
     *       headers:
     *         Set-Cookies:
     *           schema:
     *             type: string
     *             example: Authorization=abcde12345; Path=/; HttpOnly
     *       '404':
     *          description: User not found
     */
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.logginIn
    );

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     tags:
     *       - Authentification
     *     summary: Logs in and returns the authentication  cookie
     *     operationId: "loggingOut"
     *     responses:
     *       '200':
     *         description: OK
     */
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
      response.status(200).send({ message: "you are connected", data: cookie });
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
