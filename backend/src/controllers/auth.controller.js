const authService = require('../services/auth.service');
const { parseCookie } = require('../utils/cookies');
const AppError = require('../utils/appError');

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = parseCookie(req.headers.cookie, 'refresh_token');
    if (!token) {
      return next(new AppError(401, 'INVALID_REFRESH_TOKEN', '다시 로그인해 주세요.'));
    }
    const result = await authService.refresh(token);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('refresh_token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, refresh, logout };
