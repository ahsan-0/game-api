exports.handle404s = (err, req, res, next) => {
  console.log(err);
  res.status(404).send({ msg: "Not Found" });
};

exports.idDoesNotExistError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.invalidIdError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id input" });
  } else {
    next(err);
  }
};
