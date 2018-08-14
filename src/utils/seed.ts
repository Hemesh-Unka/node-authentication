import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { Rule } from "../entity/Rule";

export class SeedUtils {

  /**
  * Seed the database
  */
  async seedDB() {
    try {
      await this.seedUsers();
      await this.seedRules();
    } catch (error) {
      throw new Error(`ERROR: Seeding database: ${error}`);
    }
  }

  /**
  * Seed users
  */
  async seedUsers() {
    try {
      const userRepository = await getRepository(User);
      const users = [];

      await ["superadmin", "admin", "user", "guest"].forEach((roleName) => {
        const user = new User();
        const role = new Role();

        role.role_name = roleName;
        user.email = roleName + "@example.com";
        user.password = roleName;
        user.role = role;

        users.push(user);
        return users;
      });

      await userRepository.save(users);

    } catch (error) {
      throw new Error(`ERROR: Seeding users: ${error}`);
    }
  }

  /**
  * Seed rules
  */
  async seedRules() {
    try {
      const ruleRepository = await getRepository(Rule);

      const superadmin = new Role();
      superadmin.role_name = "superadmin";

      const admin = new Role();
      admin.role_name = "admin";

      const user = new Role();
      user.role_name = "user";

      const guest = new Role();
      guest.role_name = "guest";

      const rules = [
        { resource: "items", action: "create", attributes: "*", roles: [superadmin] },
        { resource: "users", action: "read", attributes: "*", roles: [superadmin, guest] },
        { resource: "items", action: "read", attributes: "*", roles: [superadmin, guest] },
        { resource: "users", action: "update", attributes: "*", roles: [superadmin] },
        { resource: "rules", action: "create", attributes: "*", roles: [superadmin] },
        { resource: "rules", action: "read", attributes: "*", roles: [superadmin] },
        { resource: "role", action: "create", attributes: "*", roles: [superadmin] },
        { resource: "role", action: "read", attributes: "*", roles: [superadmin] }
      ];

      ruleRepository.save(rules);

    } catch (error) {
      throw new Error(`ERROR: Seeding rules: ${error}`);
    }
  }
}