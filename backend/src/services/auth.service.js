const pool = require('../config/db');
const usersRepo = require('../repositories/users.repository');
const categoriesRepo = require('../repositories/categories.repository');
const AppError = require('../utils/appError');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function signup({ email, password, name }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await usersRepo.findByEmail(email, client);
    if (existing) {
      await client.query('ROLLBACK');
      throw new AppError(409, 'CONFLICT', '이미 등록된 이메일입니다.');
    }

    const hash = await hashPassword(password);
    const user = await usersRepo.create({ email, password: hash, name }, client);
    await categoriesRepo.createDefault({ userId: user.id }, client);

    await client.query('COMMIT');

    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

async function login({ email, password }) {
  const user = await usersRepo.findByEmail(email);

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
  };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', '다시 로그인해 주세요.');
  }

  const accessToken = signAccessToken({ id: payload.id, email: payload.email });
  return { accessToken };
}

module.exports = { signup, login, refresh };
