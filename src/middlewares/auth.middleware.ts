import RequestWithUser from "interfaces/requestWithUser.interface";
import express from "express";
import jwt from "jsonwebtoken";
import DataStoredInToken from "token/interface.DataStorageInToken";
import User from "users/user.interface";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";

export function authMiddleware(
  request: RequestWithUser,
  response: express.Response,
  next: express.NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const id = decodedToken(cookies.Authorization);
    if (Number(id) >= 1) {
      next();
    } else {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export function decodedToken(token: string) {
  const secret = process.env.JWT_SECRET;
  const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
  const id = verificationResponse._id;
  return id;
}
