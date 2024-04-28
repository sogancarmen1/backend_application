import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import User from "./user.interface";
import authMiddleware from "../middlewares/auth.middleware";

class UserController implements Controller {
  public path = "/users";
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
    this.initializeRoute();
  }

  public initializeRoute() {
    //Gerer les autorisations
    this.router.get(this.path, authMiddleware, this.getAllUsers);
    this.router.post(this.path, this.createUser);
    this.router.put(`${this.path}/:id`, this.modifyUser);
  }

  private getAllUsers = (
    request: express.Request,
    response: express.Response
  ) => {
    response.send(this.users);
  };

  private createUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const user: User = request.body;
    this.users.push(user);
    response.send(user);
  };

  private modifyUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const newUser: User = request.body;
    const index = this.users.findIndex((user) => user.id == Number(id));
    if (index != -1) {
    }
  };
}

export default UserController;
