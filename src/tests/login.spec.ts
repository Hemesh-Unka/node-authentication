import { expect } from "chai";
import * as request from "supertest";

describe("Login", () => {
  describe("POST /login", () => {
    it("is able to login using an existing user details", async () => {
      const response = await request("http://localhost:3000")
        .post("/login")
        .send({
          email: "superadmin@example.com",
          password: "superadmin"
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("auth");
      expect(response.body).to.have.property("token");
    });

    it("throws an error if email is not correct", async () => {
      const response = await request("http://localhost:3000")
        .post("/login")
        .send({
          email: "superadmin@wrong.com",
          password: "superadmin"
        });

      expect(response.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
      expect(response.body).to.not.have.property("token");
    });

    it("throws an error if password is not correct", async () => {
      const response = await request("http://localhost:3000")
        .post("/login")
        .send({
          email: "superadmin@example.com",
          password: "nottherightpassword"
        });

      expect(response.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
      expect(response.body).to.not.have.property("token");
    });
  });
});