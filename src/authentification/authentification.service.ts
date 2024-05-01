import express, { Router } from "express";
import TokenData from "token/interfaceToken";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import jwt from "jsonwebtoken";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import bcrypt from "bcrypt";
import PasswordDontMatch from "../exceptions/PasswordDontMatch";
import User from "users/user.interface";
import DataStoredInToken from "token/interface.DataStorageInToken";
import { CreateUserDto, LoginDto } from "users/user.dto";

class AuthentificationService {
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

  public async register(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const existingUser = this.users.find(
      (user) => user.email === userData.email
    );
    if (existingUser) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    } else if (userData.password !== userData.confirmPassword) {
      throw new PasswordDontMatch();
    }
    const newUser: User = {
      id: 8,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return newUser;
  }

  public async logginIn(logInData: LoginDto) {
    const user = this.users.find((user) => user.email === logInData.email);
    if (user != undefined) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return cookie;
      } else throw new WrongCredentialsException();
    } else throw new WrongCredentialsException();
  }

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
}

export default AuthentificationService;
