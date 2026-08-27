module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  console.error(JSON.stringify({
    method: req.method,
    path: req.path,
    statusCode,
    code,
    message: err.message,
  }));

  res.status(statusCode).json({ error: { code, message: err.message } });
};
