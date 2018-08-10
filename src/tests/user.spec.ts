import { expect } from "chai";
import "mocha";
import * as request from "supertest";
import app from "../server";
import { TestUtils } from "../utils/test.utils";
import { beforeEach, before } from "mocha";

const testUtils = new TestUtils();

before("connect database", async () => {
  await testUtils.startDbConnection();
});

beforeEach("seed database", async () => {
  await testUtils.reloadFixtures();
});

after("disconnect database", async () => {
  await testUtils.closeDbConnection();
});

describe("Users", () => {
  describe("GET /user", () => {
    it("should not show any users if not authorized", (done) => {
      request(app)
        .get("/users")
        .set("Accept", "application/json")
        .expect(401)
        .expect((res) => {
          expect(res.body).to.be.empty;
        }).end((err) => {
          if (err) {
            return done(err);
          }
        });
      done();
    });

    it("should be able to list users if authorized", (done) => {
      request(app)
        .get("/users")
        .expect((err) => {

        }).end((err) => {
          if (err) {
            return done(err);
          }
        });
      done();
    });
  });
});
