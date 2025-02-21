const { MONGO_ERROR_MAP } = require("../utils/mongo_errors");

const errorHandler = (err, req, res, next) => {
  const ErrorClass = MONGO_ERROR_MAP[err.name] || MONGO_ERROR_MAP[err.code];
  if (ErrorClass) err = new ErrorClass(null, { err });

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
};

module.exports = errorHandler;
