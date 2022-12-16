const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewById, getCommentsByReviewId, postComment,patchReview } = require("./controllers/controllers");
const { handle404s, handleCustomErrors, handleSQLErrors, handle500s } = require("./error-handling/erros");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.all("*", handle404s);
app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use(handle500s);
module.exports = app;
