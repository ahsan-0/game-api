const db = require("../db/connection.js");
exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviewById = (review_id) => {
  return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id]).then(({ rows }) => {
    const review = rows[0];
    if (!review) {
      return Promise.reject({ status: 404, msg: "Id does not exist" });
    }
    return review;
  });
};
