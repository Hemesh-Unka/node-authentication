import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import * as JWT from 'jsonwebtoken';

import { User } from "../entity/User";


export class RegisterController {

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      // Get user repository
      const userRespository = getRepository(User);

      const { email, password } = request.body;

      // Check if existing user exists
      const foundUser = await userRespository.findOne({ email });

      if (foundUser) throw ({
        error: 'Email is already in use'
      })

      // Create a new user
      const user = userRespository.create({ email, password });
      await userRespository.save(user);

      // Setup token
      const token = JWT.sign({
        iss: 'API',
        sub: user.uuid,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.SECRET);

      // Respond with token
      response
      .send({
        auth: true,
        token
      });

    } catch (e) {
      response
        .status(404)
        .send(e)
    }
  };
};