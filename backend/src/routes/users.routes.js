const express = require('express');
const usersController = require('../controllers/users.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const updateMeSchema = {
  name: (value) => {
    if (value === undefined) return null;
    if (typeof value !== 'string' || value.length < 1 || value.length > 100) return 'name은 1~100자여야 합니다.';
    return null;
  },
};

const router = express.Router();
router.patch('/me', authenticate, validate(updateMeSchema), usersController.updateMe);

module.exports = router;
