const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewById, getCommentsByReviewId, patchReview } = require("./controllers/controllers");
const { handle404s, handleCustomErros, handleSQLErrors, handle500s } = require("./error-handling/erros");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReview);
app.all("*", handle404s);
app.use(handleCustomErros);
app.use(handleSQLErrors);
app.use(handle500s);
module.exports = app;
