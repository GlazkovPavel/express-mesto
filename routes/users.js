const users = require('express').Router();
const {
  getUserId, getUsers, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getCurrentUser);
users.get('/:userId', getUserId);
users.patch('/me', updateUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };
