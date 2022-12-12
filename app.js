const express = require("express");
const app = express()
const {getCategories} = require("./controllers/controllers")
app.get("/api/categories")
