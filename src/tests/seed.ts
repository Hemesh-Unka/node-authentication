import "reflect-metadata";
import { Connection } from "typeorm";
import { createTypeormConn } from "../utils/createTypeormConn";
import { User } from "../entity/User";
import { Role } from "../entity/Role";

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
      this.seedUsers();
    } catch (error) {
      throw new Error(`ERROR: Seeding database: ${error}`);
    }
  }

  /**
  * Seed users
  */
  async seedUsers() {
    try {
      const user = new User();
      const role = new Role();

      // Create superadmin role
      role.role_name = "superadmin";

      // Create superadmin user
      user.email = "superadmin@example.com";
      user.password = "superadmin";
      user.role = role;

      await this.connection.getRepository(User).save(user);

    } catch (error) {
      throw new Error(`ERROR: Seeding users: ${error}`);
    }
  }
}