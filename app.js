const express = require("express");
const cors = require("cors");
const app = express();

const { getCategories, getReviews, getReviewById, getCommentsByReviewId, postComment, patchReview, getUsers } = require("./controllers/controllers");
const { handle404s, handleCustomErrors, handleSQLErrors, handle500s } = require("./error-handling/erros");

app.use(cors());
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/users", getUsers);
app.all("*", handle404s);
app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use(handle500s);
module.exports = app;
