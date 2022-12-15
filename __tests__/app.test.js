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
          review: {
            review_id: 2,
            title: "Jenga",
            category: "dexterity",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          },
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
