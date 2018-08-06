import { Request, Response, NextFunction } from "express";
import { getRepository } from "../../node_modules/typeorm";
import { Rule } from "../entity/Rule";
import { User } from "../entity/User";


// This is a way to link rules to roles

export class AuthoriseController {
  async grant(request: Request, response: Response, next: NextFunction) {
    try {
      // Assign constants
      const { email, rule } = request.body;

      // Scream if you have missing items
      if (!email || !rule) { throw ({ error: 'Request incomplete. Please try again.' }) };

      // Get repositories
      const ruleRepository = getRepository(Rule);
      const userRepository = getRepository(User);

      // Lets get a user with there role
      const foundUser = await userRepository.findOne({ where: { email }, relations: ["role"] })

      // Throw an error if a user was not found
      if (!foundUser) { throw ({ error: 'User was not found.' }) };

      // Lets get the role
      const foundRule = await ruleRepository.findOne({ where: { id: rule }, relations: ["roles"] });

      // Throw an error if a rule was not found
      if (!foundRule) { throw ({ error: 'Rule was not found.' }) };

      // Throw an error if a rule already exists under the role
      const existingRuleOnRole = await ruleRepository.findOne({ where: { id: rule }, relations: ["roles"] });
      console.log(existingRuleOnRole);

      // Hook up rule with user role
      foundRule.roles.push(foundUser.role);
      const updatedRule = await ruleRepository.save(foundRule);

      response
        .send(updatedRule);
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }
}