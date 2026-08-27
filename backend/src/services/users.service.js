const usersRepo = require('../repositories/users.repository');

async function updateProfile(userId, { name }) {
  const user = await usersRepo.updateName(userId, name);
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

module.exports = { updateProfile };
