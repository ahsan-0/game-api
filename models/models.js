const db = require("../db/connection.js");
exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviewById = () => {
  return db.query(`SELECT * FROM reviews`).then(() => {});
};
