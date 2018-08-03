import { Request, Response, NextFunction } from "express";
import { getRepository, createQueryBuilder } from "typeorm";

import { Role } from "../entity/Role";
import { Rule } from "../entity/Rule";

export class RoleController {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const roleRepository = getRepository(Role);
      const roles = await roleRepository.find();

      // If no roles exist
      if (roles === undefined || roles.length === 0) throw ({ error: 'No roles currently exist.' });

      // Send the current roles
      response
        .send(roles)
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }

  async add(request: Request, response: Response, next: NextFunction) {
    try {
      // Assign constants
      const { role_name, resource, action, attributes } = request.body;

      // Check if request is empty (Poorly!)
      if (request.body.role_name === undefined || request.body.resource === undefined) throw ({ error: 'You cannot create an incomplete/empty role.' })

      // Get role repository & rule repository
      const roleRepository = getRepository(Role);
      const ruleRepository = getRepository(Rule);

      // Create and save a new role
      const role = await roleRepository.create({ role_name });
      await roleRepository.save(role);

      // Create a new rule
      const rule = await ruleRepository.create({ resource: resource, action: action, attributes: attributes })

      // Add rules to roles
      rule.roles = [role];
      
      // Save the rule
      await ruleRepository.save(rule);

      // Send the response back to the user
      response
        .status(200)
        .send(rule)
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }
}