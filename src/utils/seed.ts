import "reflect-metadata";
import { Connection, getRepository, getConnection } from "typeorm";
import { createTypeormConn } from "./createTypeormConn";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { Rule } from "../entity/Rule";

export class SeedUtils {
  private connection: Connection;

  /**
  * Opens the database connection
  */
  async startDbConnection() {
    try {
      this.connection = (await createTypeormConn());
    } catch (error) {
      throw new Error(`ERROR: Connecting to db: ${error}`);
    }
  }

  /**
  * Closes the database connection
  */
  async closeDbConnection() {
    try {
      if (this.connection.isConnected) {
        await (await this.connection).close();
      }
    } catch (error) {
      throw new Error(`ERROR: Disconnecting from db: ${error}`);
    }
  }

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

      const rules = [
        { resource: "items", action: "create", attributes: "*" },
        { resource: "items", action: "read", attributes: "*" },
        { resource: "users", action: "read", attributes: "*" },
        { resource: "users", action: "update", attributes: "*" }
      ];

      ruleRepository.save(rules);

    } catch (error) {
      throw new Error(`ERROR: Seeding rules: ${error}`);
    }
  }
}