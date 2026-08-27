const todosService = require('../services/todos.service');

async function list(req, res, next) {
  try {
    const todos = await todosService.listTodos(req.user.id, { categoryId: req.query.categoryId, status: req.query.status });
    res.status(200).json(todos);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const todo = await todosService.createTodo(req.user.id, req.body);
    res.status(201).json(todo);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const todo = await todosService.updateTodo(req.user.id, req.params.id, req.body);
    res.status(200).json(todo);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await todosService.deleteTodo(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
