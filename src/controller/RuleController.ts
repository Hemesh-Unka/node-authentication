import { Request, Response, NextFunction } from "express";
import { Rule } from "../entity/Rule";
import { getRepository } from "typeorm";

export class RuleController {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const ruleRepository = getRepository(Rule);
      const rules = await ruleRepository.find();

      if (rules === undefined || rules.length === 0) throw ({ error: 'No rules currently exist.' });

      response
        .send(rules)
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Assign constants
      const { resource, action, attributes } = request.body;

      // Get the rule repository
      const ruleRepository = getRepository(Rule);

      // Check if the rule already exists
      const ruleExits = await ruleRepository.findOne({ resource, action, attributes });

      // If rule exists, handle the issue
      if (ruleExits) { throw ({ error: 'The rule already currently exists.' }) };

      // Create a new rule
      const rule = ruleRepository.create({ resource, action, attributes });
      await ruleRepository.save(rule);

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