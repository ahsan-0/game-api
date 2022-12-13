const db = require("../db/connection.js");
exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id,reviews.title,reviews.owner,reviews.category,reviews.review_img_url,reviews.created_at,reviews.votes,reviews.designer, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
