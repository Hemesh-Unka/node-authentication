import { expect } from "chai";
import "mocha";
import * as request from "supertest";
import app from "../server";

describe("Home", () => {
  describe("#GET /", () => {
    it("should error on the home page", (done) => {
      request(app)
        .get("/")
        .set("Accept", "application/json")
        .expect(404)
        .expect((res) => {
        }).end((err) => {
          if (err) {
            return done(err);
          }
        });
      done();
    });
  });
});
