const AppError = require('./appError');

function assertOwnership(resourceOwnerId, requestUserId) {
  if (resourceOwnerId !== requestUserId) {
    throw new AppError(403, 'FORBIDDEN', '리소스에 대한 권한이 없습니다.');
  }
}

module.exports = { assertOwnership };
