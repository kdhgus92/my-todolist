const AppError = require('../utils/appError');
const { verifyAccessToken } = require('../utils/jwt');

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Authorization 헤더가 없습니다.'));
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    next(new AppError(401, 'UNAUTHORIZED', '유효하지 않은 토큰입니다.'));
  }
};
