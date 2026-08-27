const AppError = require('../utils/appError');

module.exports = function validate(schema) {
  return function (req, res, next) {
    for (const field of Object.keys(schema)) {
      const message = schema[field](req.body[field], req.body);
      if (message) {
        return next(new AppError(400, 'VALIDATION_ERROR', message));
      }
    }
    next();
  };
};
