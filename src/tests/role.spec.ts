import * as request from "supertest";
import { expect } from "chai";
import { Role } from "../entity/Role";

let token;

before("login superadmin", async () => {
  const response = await request("http://localhost:3000")
    .post("/login")
    .set("Accept", "application/json")
    .send({
      email: "superadmin@example.com",
      password: "superadmin"
    });

  token = response.body.token;
});

const randomRole = new Role();
randomRole.role_name = "randomRole";

describe("Role", () => {
  describe("POST /rules", () => {
    it("throws an error if trying to create a new role without permission", async () => {
      const response = await request("http://localhost:3000")
        .post("/roles")
        .send(randomRole);

      expect(response.status).to.equal(401);
      expect(response.error.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
    });

    it("can post a new role if authorized to do so", async () => {
      const response = await request("http://localhost:3000")
        .post("/roles")
        .set("Authorization", token)
        .send(randomRole);

      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.deep.include(randomRole);
    });

    it("throws an error if a role already exists", async () => {
      const response = await request("http://localhost:3000")
        .post("/roles")
        .set("Authorization", token)
        .send(randomRole);

      expect(response.status).to.equal(400);
      expect(response.type).to.equal("application/json");
      expect(response.error.status).to.equal(400);
      expect(response.body).to.include({ error: "The role already currently exists." });
    });
  });

  describe("GET /roles", () => {

    it("throws an error if trying to access the current list of roles without permission", async () => {
      const response = await request("http://localhost:3000")
        .get("/roles");

      expect(response.status).to.equal(401);
      expect(response.error.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
    });

    it("returns a list of roles if authorized", async () => {
      const response = await request("http://localhost:3000")
        .get("/roles")
        .set("Authorization", token);

      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body[response.body.length - 1]).to.include(randomRole);
    });
  });

  // it("throws an error if the list of roles are empty", async () => {
  //   const response = await request("http://localhost:3000")
  //     .get("/roles")
  //     .set("Authorization", token);

  //   expect(response.status).to.equal(400);
  //   expect(response.type).to.equal("application/json");
  //   expect(response.body).to.include({ error: "No roles currently exist." });
  // });
});
