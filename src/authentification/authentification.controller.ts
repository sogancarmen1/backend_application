import bcrypt from "bcrypt";
import PasswordDontMatch from "../exceptions/PasswordDontMatch";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import RegisterDto from "../users/user.dto";
import User from "users/user.interface";
import LoginDto from "../users/login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import validationMiddleware from "../middlewares/validation.middleware";
import DataStoredInToken from "token/interface.DataStorageInToken";
import jwt from "jsonwebtoken";
import TokenData from "token/interfaceToken";

class AuthentificationController implements Controller {
  public path = "/auth";
  public router = express.Router();

  private users: User[] = [
    {
      id: 1,
      firstName: "sogan",
      lastName: "yaya",
      email: "admin@gmail.com",
      password: "123456789",
    },
    {
      id: 2,
      firstName: "carmen",
      lastName: "yoyo",
      email: "carmen@gmail.com",
      password: "1234",
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterDto),
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
    const userData: RegisterDto = request.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const existingUser = this.users.find(
      (user) => user.email === userData.email
    );
    if (existingUser) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else if (userData.password !== userData.confirmPassword) {
      next(new PasswordDontMatch());
    } else {
      const newUser: User = {
        id: 8,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
      };
      this.users.push(newUser);
      response.send(newUser);
    }
  };

  private logginIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LoginDto = request.body;
    const user = this.users.find((user) => user.email === logInData.email);
    if (user != undefined) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        response.send(user);
        console.log(tokenData);
      } else next(new WrongCredentialsException());
    } else next(new WrongCredentialsException());
  };

  //Cette fonction createCookie sert à générer une chaîne de caractères représentant un cookie HTTP à envoyer au client dans l'en-tête de réponse.
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  //Crée le token avec le code secret, les données à y intégrer et son temps d'expiration
  private createToken(user: User) {
    const expiresIn = 900;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: String(user.id),
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
}

export default AuthentificationController;
