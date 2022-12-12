const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
beforeEach(() => seed(testData));
afterAll(() => {
  if (db.end) db.end();
});
describe("GET /api/categories", () => {
  test("should respond with 200 and get all categories from test data", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const categories = testData.categoryData;
        expect(body).toEqual({ categories });
      });
  });
});
