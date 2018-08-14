import * as request from "supertest";
import { expect } from "chai";

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

const randomRule = {
  "resource": "randomResource",
  "action": "randomAction",
  "attributes": "randomAttributes"
};

describe("Rule", () => {
  describe("POST /rules", () => {
    it("cannot post a new rule if not authorized", async () => {
      const response = await request("http://localhost:3000")
        .post("/rules")
        .send({
          resource: "randomResource",
          action: "read",
          attributes: "*"
        });

      expect(response.status).to.equal(401);
      expect(response.error.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
    });

    it("can post a new rule if authorized to do so", async () => {
      const response = await request("http://localhost:3000")
        .post("/rules")
        .set("Authorization", token)
        .send(randomRule);

      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.deep.include(randomRule);
    });
  });

  describe("GET /rules", () => {
    it("cannot get a list of rules if not authorized", async () => {
      const response = await request("http://localhost:3000")
        .get("/rules");

      expect(response.status).to.equal(401);
      expect(response.error.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
    });

    it("can get a list of rules if authorized", async () => {
      const response = await request("http://localhost:3000")
        .get("/rules")
        .set("Authorization", token);

      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body[response.body.length - 1]).to.include(randomRule);
    });
  });
});