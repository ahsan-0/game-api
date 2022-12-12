const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers");
const { handle500s } = require("./error-handling/erros");

app.use(express.json());

app.get("/api/categories", getCategories);
app.all("*", handle500s);

module.exports = app;
