import { getRepository } from "../../node_modules/typeorm";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class LoginController {
  private userRespository = getRepository(User);

  async login(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRespository.findOne({ email: request.body.email });

    // Check if user is found
    if (!user) return {
      auth: false,
      token: null
    };

    // User is found, now lets check if passwords match
    let passwordIsValid = bcrypt.compareSync(request.body.password, user.password);

    // Check if password is matching
    if (!passwordIsValid) return {
      auth: false,
      token: null
    };

    // If password is matching then send JWT Token
    let token = jwt.sign({ uuid: user.uuid }, process.env.SECRET, { expiresIn: "1h" })

    // Return a token
    return {
      auth: true,
      token: token
    };
  };
};