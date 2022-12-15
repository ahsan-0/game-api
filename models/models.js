const db = require("../db/connection.js");
exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id,reviews.title,reviews.owner,reviews.category,reviews.review_img_url,reviews.created_at,reviews.votes,reviews.designer, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at desc;`
    )
    .then(({ rows }) => {
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

exports.selectCommentsByReviewId = (review_id) => {
  return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at desc`, [review_id]).then(({ rows }) => {
    return rows;
  });
};

exports.createComment = (newComment) => {
  const { username, body } = newComment;
  return db.query(`INSERT INTO comments(author,body) VALUES($1,$2)`, [username, body]);
};
