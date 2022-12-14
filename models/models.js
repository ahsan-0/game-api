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

exports.createComment = (newComment, review_id) => {
  const { username, body } = newComment;
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Missing Information" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Information Provided is in incorrect format" });
  }
  return db
    .query("SELECT username FROM users")
    .then(({ rows }) => {
      const usernames = rows.map((user) => {
        return user.username;
      });
      if (!usernames.includes(username)) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return db.query(`INSERT INTO comments(review_id,author,body) VALUES($1,$2,$3) RETURNING author,body`, [review_id, username, body]);
    })
    .then(({ rows }) => {
      const comment = rows[0];
      return comment;
    });
};

exports.selectReviewToPatch = (newPatch, review_id) =>{
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING title,designer,owner,review_img_url,review_body,category,created_at,votes;`,
      [newPatch, review_id]
    )
    .then(({ rows }) => {
      const updatedReview = rows[0];
      return updatedReview;
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT username,avatar_url,name FROM users`).then(({ rows }) => {
    return rows;
  });
};
