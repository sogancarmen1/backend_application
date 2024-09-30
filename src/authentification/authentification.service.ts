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
import UserService from "users/user.service";

class AuthentificationService {
  userRepository: UserService;
  constructor(repository: UserService) {
    this.userRepository = repository;
  }

  public async register(userData: CreateUserDto) {
    if (userData.password !== userData.confirmPassword) {
      throw new PasswordDontMatch();
    }
    const existingUser = await this.userRepository.isEmailExist(userData.email);
    if (existingUser) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await this.userRepository.createdUser(userData, hashedPassword);
  }

  public async loggin(logInData: LoginDto) {
    const user = await this.userRepository.findUserByEmail(logInData.email);
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
  //HttpOnly : Empêche l’accès au cookie via JavaScript côté client.
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; Path=/; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=None`;
  }

  //Crée le token avec le code secret, les données à y intégrer et son temps d'expiration
  private createToken(user: User) {
    const expiresIn = 60 * 60;
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
