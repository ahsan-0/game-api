const { selectCategories, selectReviewById } = require("../models/models");
const { selectCategories, selectReviews } = require("../models/models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
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
      
exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });

    })
    .catch((err) => {
      next(err);
    });
};
