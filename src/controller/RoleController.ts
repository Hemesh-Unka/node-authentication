import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { Role } from "../entity/Role";
import { AuthorizeMiddleware } from "../middleware/accesscontrol.middleware";
import { EndPoint } from "../utils/endpoint";

class RoleInterface {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const roleRepository = getRepository(Role);
      const roles = await roleRepository.find();

      if (roles === undefined || roles.length === 0) throw ({ error: "No roles currently exist." });

      response
        .send(roles);
    } catch (e) {
      response
        .status(400)
        .send(e);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Assign constants
      const { role_name } = request.body;

      // Get role repository
      const roleRepository = getRepository(Role);

      // Check if a role exists
      const roleExists = await roleRepository.findOne({ role_name });

      if (roleExists) { throw ({ error: "The role already currently exists." }); }

      // Create a new role
      const role = await roleRepository.create({ role_name });
      await roleRepository.save(role);

      response
        .status(200)
        .send(role);
    } catch (e) {
      response
        .status(400)
        .send(e);
    }
  }
}

export class RoleController {
  private roleInterface: RoleInterface = new RoleInterface();
  private authorize: AuthorizeMiddleware = new AuthorizeMiddleware();

  public readonly all: EndPoint = {
    authorize: this.authorize.authorize("read", "role"),
    method: this.roleInterface.all
  };

  public readonly create: EndPoint = {
    authorize: this.authorize.authorize("create", "role"),
    method: this.roleInterface.create
  };
}