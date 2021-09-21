const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserId, getUsers, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getCurrentUser);
users.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUserId);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(http|https):\/\/(www\.)?[\w-._~:/?#[\]@!$&'()*+,;=%]+#?$/i),
  }),
}), updateAvatar);

module.exports = { users };
