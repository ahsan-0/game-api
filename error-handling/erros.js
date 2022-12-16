exports.handle404s = (err, req, res, next) => {
  console.log(err);
  res.status(404).send({ msg: "Not Found" });
};

exports.handleCustomErros = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id input" });
  } else {
    next(err);
  }
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
