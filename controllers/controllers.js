const { selectCategories, selectReviewById } = require("../models/models");

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
  console.log(req.url)
  const id = req.params;
  console.log(id);
};
