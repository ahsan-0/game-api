const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers/controllers");
const { handle500s } = require("./error-handling/erros");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.all("*", handle500s);

module.exports = app;
