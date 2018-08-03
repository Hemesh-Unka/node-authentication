import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import * as JWT from 'jsonwebtoken';

import { User } from "../entity/User";
import { Role } from "../entity/Role";

export class RegisterController {

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      // Setting individual constants
      const { email, password, assigned_role } = request.body;

      // Get user repository
      const userRespository = getRepository(User);

      // Get role repository
      const roleRepository = getRepository(Role);

      // Check if existing user exists
      const existingUser = await userRespository.findOne({ email });
      if (existingUser) throw ({ error: 'Email is already in use.' })

      // Create a new user
      const user = userRespository.create({ email, password });

      // Create a new role
      const role = roleRepository.create({ role_name: assigned_role });

      // Assign the role to a user
      user.role = role;

      // Save user
      await userRespository.save(user);

      // Setup token
      const token = JWT.sign({
        iss: 'API',
        sub: user.uuid,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.JWT_SECRET);

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