import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import * as Path from "path";
import * as fs from "fs";

export class TestUtils {
  private connection: Connection;

  /**
  * Opens the database connection
  */
  async startDbConnection() {
    try {
      this.connection = (await createConnection(process.env.NODE_ENV));
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
   * Cleans the database and reloads the entries
   */
  async reloadFixtures() {
    const entities = await this.getEntities();
    await this.cleanAll(entities);
    await this.loadAll(entities);
  }

  /**
   * Cleans all the entities
   */
  async cleanAll(entities) {
    try {
      for (const entity of entities.sort((a, b) => b.order - a.order)) {
        const repository = await this.connection.getRepository(entity.name);
        await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  /**
  * Returns the entites of the database
  */
  async getEntities() {
    const entities = [];
    (await (await this.connection).entityMetadatas).forEach(
      x => entities.push({ name: x.name, tableName: x.tableName })
    );
    return entities;
  }

  /**
   * Insert the data from the src/test/fixtures folder
   */
  async loadAll(entities) {
    try {
      for (const entity of entities) {
        const repository = await this.connection.getRepository(entity.name);
        const fixtureFile = Path.join(__dirname, `../tests/fixtures/${entity.name}.json`);
        if (fs.existsSync(fixtureFile)) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, "utf8"));
          await repository
            .createQueryBuilder(entity.name)
            .insert()
            .values(items)
            .execute();
        }
      }
    } catch (error) {
      throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixtures on db: ${error}`);
    }
  }
}