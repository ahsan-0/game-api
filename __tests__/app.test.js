const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");

describe("GET /api/categories", () => {
  test("should respond with 200 and get all categories from test data", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(testData.categoryData);
      });
  });
});
