import { getRepository } from "../../node_modules/typeorm";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';

export class LoginController {

  public async login(request: Request, response: Response, next: NextFunction) {
    try {
      // Get user repository
      const userRespository = getRepository(User);

      // Find the user
      let user = await userRespository.findOne({ email: request.body.email });

      // Check if user is found
      if (!user) throw {
        auth: false,
        token: null
      };

      // Password matching step?
      

      // If password is matching then send JWT Token
      const token = JWT.sign({
        iss: 'API',
        sub: user.uuid,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.SECRET);

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
        .send(e)
    }
  }
};