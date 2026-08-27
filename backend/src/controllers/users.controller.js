const usersService = require('../services/users.service');

async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateProfile(req.user.id, { name: req.body.name });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await usersService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { updateMe, getMe };
