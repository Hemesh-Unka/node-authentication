import { expect } from "chai";
import * as request from "supertest";

describe("Logout", () => {
  describe("GET /logout", () => {
    it("logouts a user", async () => {
      const response = await request("http://localhost:3000")
        .get("/logout");

      expect(response.status).to.equal(200);
      expect(response.body.auth).equal(false);
      expect(response.body.token).equal(null);
    });
  });
});