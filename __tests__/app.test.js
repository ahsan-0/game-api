const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
require("jest-sorted");
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
        const { categories } = body;
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("categories array should have a length of 4", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
      });
  });
});

describe("GET /api/reviews", () => {
  test("should respond with 200 and get all reviews with an added key of comment count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(review).not.toHaveProperty("review_body", expect.any(String));
        });
      });
  });
  test("review array should have a length of 13", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
      });
  });
  test("review array should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted({ descending: true, key: "created_at" });
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

describe("GET /api/reviews/:review_id/comments", () => {
  test("should respond with 200 and a comment object with the corresponding comment", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            review_id: 2,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("should respond with a 404 Not Found when passed an id that does not exist", () => {
    return request(app)
      .get("/api/reviews/90/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Id does not exist" });
      });
  });
  test("should respond with a 200 and a comments object set to an empty array when passed an id that exists but has no comments", () => {
    return request(app)
      .get("/api/reviews/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });
  test("should respond with a 400 Bad Request when passed an id that is invalid", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid id input" });
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () =>{
  test("should respond with a 201 and an object of the newly posted comment", () => {
    const newComment = {
      username: "mallionaire",
      body: "amazing game for the family",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          postedComment: { author: "mallionaire", body: "amazing game for the family" },
        });
      });
  });
  test("should respond with a 404 Not Found when passed an id that does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "amazing game for the family",
    };
    return request(app)
      .post("/api/reviews/14/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Id does not exist" });
      });
  });
  test("should respond with a 400 when passed an invalid id", () => {
    const newComment = {
      username: "mallionaire",
      body: "amazing game for the family",
    };
    return request(app)
      .post("/api/reviews/bananas/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid id input" });
      });
  });
  test("should respond with a 400 Bad Request when properties are set to incorrect datatypes", () => {
    const newComment = {
      username: 11,
      body: true,
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Information Provided is in incorrect format" });
      });
  });
  test("should respond with a 404 Not Found when a username to POST as does not exist", () => {
    const newComment = {
      username: "steve",
      body: "just do it",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "User does not exist" });
      });
  });
  test("should ignore extra information user inputs when doing a POST", () => {
    const newComment = {
      username: "mallionaire",
      body: "great game",
      best_comment: true,
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          postedComment: { author: "mallionaire", body: "great game" },
        });
        expect(body).toMatchObject(expect.not.objectContaining({ best_comment: true }));
      });
  });
  test("should respond with a 400 Bad Request when request does not contain correct properties", () => {
    const newComment = {
      age: 12,
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Missing Information" });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("should respond with a 200 and an object of the patched review", () => {
    const patch = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          patchedReview: {
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 2,
          },
        });
      });
  });
  test("should respond with a 404 when passed an id that does not exist", () => {
    const patch = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/reviews/19")
      .send(patch)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Id does not exist" });
      });
  });
  test("should respond with a 400 when passed an invalid id", () => {
    const patch = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/reviews/banana")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid id input" });
      });
  });
  test("should respond with a 400 when patch information is insufficent", () => {
    const patch = {
      body: "wrong information",
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(patch)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Patch request is in incorrect format" });
      });
  });
});
