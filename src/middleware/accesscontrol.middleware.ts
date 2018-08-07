import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Rule } from '../entity/Rule';

export class RoleMiddleware {
  private async getGrants() {
    try {
      // Get rule repository
      const ruleRepository = getRepository(Rule);

      // Get all rules with associated roles
      const rules = await ruleRepository.find({ relations: ['roles'] });

      // Sort rules into AccessControl readable object
      let grantArray = [];

      rules.forEach((rule) => {
        let roleObject = {};

        roleObject['resource'] = rule.resource,
          roleObject['action'] = rule.action,
          roleObject['attributes'] = rule.attributes

        rule.roles.forEach((role) => {
          roleObject['role'] = role.role_name
          grantArray.push(roleObject);
        });
        return grantArray;
      });

      // Return array
      return grantArray;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async accessControlMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
      // Create a new access control object
      const ac = new AccessControl();

      // Pass in grants to access control
      ac.setGrants(this.getGrants());



      
      next();
    } catch (e) {
      next();
    }
  }
}
