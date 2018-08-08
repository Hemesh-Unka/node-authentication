import { AccessControl } from "accesscontrol";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Rule } from "../entity/Rule";

interface Grant {
  role: string;
  resource: string;
  action: string;
  attributes: string;
}

export class AuthorizeMiddleware {

  private async getGrants(): Promise<Grant[]> {
    // Get rule repository
    const ruleRepository = getRepository(Rule);

    // Get all rules with associated roles
    const rules: Rule[] = await ruleRepository.find({ relations: ["roles"] });

    // Sort rules into AccessControl readable object
    let grants: Grant[] = [];

    rules.forEach((rule) => {
      rule.roles.forEach((role) => {
        grants.push({
          role: role.role_name,
          resource: rule.resource,
          action: rule.action,
          attributes: rule.attributes
        });
      });
    });
    return grants;
  }

  public authorize(action: string, resource: string) {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        // Create Access Control object
        const ac = new AccessControl();

        // Set Grants
        ac.setGrants(await this.getGrants());

        // Get current user for request
        const user = request.user;

        // Check for permissions
        const permission = await ac.can(user.role.role_name)[action](resource);
        if (!permission.granted) throw ({ error: "Unauthroized access" });

        // Set up permission to be used on later on down the track
        response.locals.ac = ac;
        next();
      } catch (e) {
        response
          .send(e)
          .status(401);
      }
    };
  }
}