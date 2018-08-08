import { NextFunction, Request, Response } from "express";
import * as JWT from "jsonwebtoken";

export class LoginController {

  public async login(request: Request, response: Response, next: NextFunction) {
    try {

      // Generate a token
      const token = JWT.sign({
        iss: "API",
        sub: request.user.uuid,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.JWT_SECRET);

      // Return a token
      response
      .status(200)
      .send({
        auth: true,
        token
      });

    } catch (e) {
      response
        .status(400)
        .send(e);
    }
  }
}