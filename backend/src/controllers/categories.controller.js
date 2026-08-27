const categoriesService = require('../services/categories.service');

async function list(req, res, next) {
  try {
    const categories = await categoriesService.listCategories(req.user.id);
    res.status(200).json(categories);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const category = await categoriesService.createCategory(req.user.id, req.body.name);
    res.status(201).json(category);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await categoriesService.deleteCategory(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, create, remove };
