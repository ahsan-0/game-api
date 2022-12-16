const { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId, selectReivewToPatch } = require("../models/models");

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

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const patch = req.body.inc_votes;
  selectReviewById(review_id)
    .then(() => {
      if (patch === undefined) {
        return Promise.reject({ status: 400, msg: "Patch request is in incorrect format" });
      }
      return selectReivewToPatch(patch, review_id);
    })
    .then((patchedReview) => {
      res.status(200).send({ patchedReview });
    })
    .catch(next);
};
