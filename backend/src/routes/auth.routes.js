const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = {
  email: (value) => {
    if (!value) return 'email은 필수입니다.';
    if (typeof value !== 'string' || value.length > 255 || !EMAIL_REGEX.test(value)) return '올바른 email 형식이 아닙니다.';
    return null;
  },
  password: (value) => {
    if (!value) return 'password는 필수입니다.';
    if (typeof value !== 'string' || value.length < 8) return 'password는 최소 8자 이상이어야 합니다.';
    return null;
  },
  name: (value) => {
    if (!value) return 'name은 필수입니다.';
    if (typeof value !== 'string' || value.length < 1 || value.length > 100) return 'name은 1~100자여야 합니다.';
    return null;
  },
};

const loginSchema = {
  email: (value) => (!value || typeof value !== 'string') ? 'email은 필수입니다.' : null,
  password: (value) => (!value || typeof value !== 'string') ? 'password는 필수입니다.' : null,
};

const router = express.Router();
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

module.exports = router;
