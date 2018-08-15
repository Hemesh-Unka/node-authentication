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

describe("User", () => {
  describe("GET /users", () => {
    describe("All Users", () => {
      it("throws an error if trying to access a current list of users without permission", async () => {
        const response = await request("http://localhost:3000")
          .get("/users");

        expect(response.status).to.equal(401);
        expect(response.error.status).to.equal(401);
        expect(response.error.text).to.equal("Unauthorized");
      });

      it("returns a list of users if authorized", async () => {
        const response = await request("http://localhost:3000")
          .get("/users")
          .set("Authorization", token);

        expect(response.status).to.equal(200);
        expect(response.type).to.equal("application/json");
        expect(response.body.find(x => x.id === response.body.length)).to.include({ email: "superadmin1@example.com" });
      });
    });

    describe("One User", () => {
      it("throws an error if trying to access a current user without permission", async () => {
        const response = await request("http://localhost:3000")
          .post("/users")
          .send({
            email: "superadmin@gmail.com"
          });

        expect(response.status).to.equal(401);
        expect(response.error.status).to.equal(401);
        expect(response.error.text).to.equal("Unauthorized");
      });
    });

    it("returns a user if found and has permission", async () => {
      const response = await request("http://localhost:3000")
        .post("/users")
        .set("Authorization", token)
        .send({
          email: "superadmin@example.com"
        });

      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.include({ email: "superadmin@example.com" });
    });

    it("throws an error if a user is not found and has permission", async () => {
      const response = await request("http://localhost:3000")
        .post("/users")
        .set("Authorization", token)
        .send({
          email: "aNonExistantUser@example.com"
        });

      expect(response.status).to.equal(400);
      expect(response.error.status).to.equal(400);
      expect(response.body).to.include({ error: "User not found" });
    });
  });

  describe("PUT /users", () => {
    it("throws an error if a user does not have permission to edit a user", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .send({
          email: "superBadman@gmail.com"
        });

      expect(response.status).to.equal(401);
      expect(response.error.status).to.equal(401);
      expect(response.error.text).to.equal("Unauthorized");
    });

    it("throws an error if part of the request is empty", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "",
          oldPassword: "",
          newPassword: "notsosuperadmin",
          confirmPassword: "notsosuperadmin"
        });

      expect(response.status).to.equal(400);
      expect(response.error.status).to.equal(400);
      expect(response.body).to.include({ error: "Missing properties to carry out request succcessfully" });
    });

    it("throws an error if you cannot find the user to edit", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "notsuperadmin@example.com",
          oldPassword: "notsosuperadmin",
          newPassword: "notsosuperadmin",
          confirmPassword: "notsosuperadmin"
        });

      expect(response.status).to.equal(400);
      expect(response.error.status).to.equal(400);
      expect(response.body).to.include({ error: "Email does not exist." });
    });

    it("throws an error if you try and edit another user", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "admin@example.com",
          oldPassword: "admin",
          newPassword: "admin",
          confirmPassword: "admin"
        });

      expect(response.error.status).to.equal(400);
      expect(response.body).to.include({ error: "Unable to edit another user" });
    });

    it("throws an error if your old password provided does not match the one stored in the database", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "superadmin@example.com",
          oldPassword: "admin",
          newPassword: "superadmin",
          confirmPassword: "superadmin"
        });

      expect(response.status).to.equal(400);
      expect(response.error.status).to.equal(400);
      expect(response.body).to.deep.equal({ error: "Current password does not match." });
    });

    it("throws an error if new and confirm password do not match", async () => {
      const response = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "superadmin@example.com",
          oldPassword: "superadmin",
          newPassword: "superadmin",
          confirmPassword: "notsosuperadmin"
        });

      expect(response.status).to.equal(400);
      expect(response.error.status).to.equal(400);
      expect(response.body).to.deep.equal({ error: "Passwords do not match." });
    });

    it("successfully changes the password", async () => {
      const updateUserResponse = await request("http://localhost:3000")
        .put("/users")
        .set("Authorization", token)
        .send({
          email: "superadmin@example.com",
          oldPassword: "superadmin",
          newPassword: "password",
          confirmPassword: "password"
        });

      expect(updateUserResponse.status).to.equal(200);
      expect(updateUserResponse.body.email).to.equal("superadmin@example.com");

      const userQueryBody = await request("http://localhost:3000")
        .post("/users")
        .set("Authorization", token)
        .send({
          email: "superadmin@example.com"
        });

      expect(updateUserResponse.body.password).to.equal(userQueryBody.body.password);
    });
  });
});