module.exports = function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    console.log(JSON.stringify({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - startTime,
    }));
  });

  next();
};
