import { expect } from "chai";
import "mocha";
import * as request from "supertest";
import { startServer } from "../bootstrap";

const email = "superadmin@example.com";
const password = "superadmin";
const assigned_role = "superadmin";

before(async () => {
  const app = await startServer();
});


describe("Register", () => {
  describe("POST /register", () => {
    it("it should register a new user", async () => {
      const response = await request("http://localhost:3000")
        .post("/register")
        .send({
          email,
          password,
          assigned_role
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("auth");
      expect(response.body).to.have.property("token");
    });

    it("it should not be able to register the same new user", async () => {
      const response = await request("http://localhost:3000")
        .post("/register")
        .send({
          email,
          password,
          assigned_role
        });

      expect(response.status).to.equal(404);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.include({ "error": "Email is already in use." });
    });
  });
});