const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  createComment,
  selectReviewToPatch,selectUsers
} = require("../models/models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then(() => {
      return selectCommentsByReviewId(review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then(() => {
      return createComment(newComment, review_id);
    })
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};
exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const patch = req.body.inc_votes;
  selectReviewById(review_id)
    .then(() => {
      if (patch === undefined) {
        return Promise.reject({ status: 400, msg: "Patch request is in incorrect format" });
      }
      return selectReviewToPatch(patch, review_id);
    })
    .then((patchedReview) => {
      res.status(200).send({ patchedReview });

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
      })
    .catch(next);
};
