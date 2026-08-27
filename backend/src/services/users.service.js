const usersRepo = require('../repositories/users.repository');
const AppError = require('../utils/appError');

async function updateProfile(userId, { name }) {
  const user = await usersRepo.updateName(userId, name);
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

async function getProfile(userId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new AppError(404, 'NOT_FOUND', '사용자를 찾을 수 없습니다.');
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

module.exports = { updateProfile, getProfile };
