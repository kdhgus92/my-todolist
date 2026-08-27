const express = require('express');
const todosController = require('../controllers/todos.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const createTodoSchema = {
  title: (v) => (typeof v !== 'string' || v.length < 1 || v.length > 200) ? 'title은 1~200자여야 합니다.' : null,
  startDate: (v) => (typeof v !== 'string' || !v) ? 'startDate는 필수입니다.' : null,
  endDate: (v) => (typeof v !== 'string' || !v) ? 'endDate는 필수입니다.' : null,
  categoryId: (v) => (v === undefined || v === null || typeof v === 'string') ? null : 'categoryId 형식이 올바르지 않습니다.',
};

const updateTodoSchema = {
  title: (v) => v === undefined ? null : (typeof v !== 'string' || v.length < 1 || v.length > 200) ? 'title은 1~200자여야 합니다.' : null,
  startDate: (v) => v === undefined ? null : (typeof v !== 'string' || !v) ? 'startDate 형식이 올바르지 않습니다.' : null,
  endDate: (v) => v === undefined ? null : (typeof v !== 'string' || !v) ? 'endDate 형식이 올바르지 않습니다.' : null,
  categoryId: (v) => v === undefined ? null : (typeof v !== 'string') ? 'categoryId 형식이 올바르지 않습니다.' : null,
  isDone: (v) => v === undefined ? null : (typeof v !== 'boolean') ? 'isDone은 boolean이어야 합니다.' : null,
};

const router = express.Router();
router.get('/', authenticate, todosController.list);
router.post('/', authenticate, validate(createTodoSchema), todosController.create);
router.patch('/:id', authenticate, validate(updateTodoSchema), todosController.update);
router.delete('/:id', authenticate, todosController.remove);

module.exports = router;
