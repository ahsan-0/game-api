const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const categories = testData.categoryData;
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
        expect(body).toEqual({ categories });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("should respond with 200 and a review object with correct review id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          review: expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          }),
        });
      });
  });
  test("should respond with 404 Not Found when an id that does not exist is passed", () => {
    return request(app)
      .get("/api/reviews/50")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Id does not exist");
      });
  });
  test("should respond with 400 Bad Request when id passed is invalid", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id input");
      });
  });
});
