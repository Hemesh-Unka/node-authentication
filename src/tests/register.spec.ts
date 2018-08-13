import { expect } from "chai";
import * as request from "supertest";
import { startServer } from "../bootstrap";
import { SeedUtils } from "../utils/seed";

const seedUtils = new SeedUtils();

before("start server", async () => {
  await startServer();
});

before("seed database", async () => {
  await seedUtils.seedDB();
});

describe("Register", () => {
  describe("POST /register", () => {
    it("registers a new user", async () => {
      const response = await request("http://localhost:3000")
        .post("/register")
        .set("Accept", "application/json")
        .send({
          email: "superadmin1@example.com",
          password: "superadmin1",
          assigned_role: "superadmin"
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("auth");
      expect(response.body).to.have.property("token");
    });

    it("cannot register another user using the same email", async () => {
      const response = await request("http://localhost:3000")
        .post("/register")
        .set("Accept", "application/json")
        .send({
          email: "superadmin1@example.com",
          password: "superadmin1",
          assigned_role: "superadmin"
        });

      expect(response.status).to.equal(404);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.deep.equal({ "error": "Email is already in use." });
    });
  });
});