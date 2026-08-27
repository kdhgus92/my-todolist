const express = require('express');
const categoriesController = require('../controllers/categories.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const createCategorySchema = {
  name: (value) => {
    if (typeof value !== 'string' || value.length < 1 || value.length > 100) return 'name은 1~100자여야 합니다.';
    return null;
  },
};

const router = express.Router();
router.get('/', authenticate, categoriesController.list);
router.post('/', authenticate, validate(createCategorySchema), categoriesController.create);
router.delete('/:id', authenticate, categoriesController.remove);

module.exports = router;
