const users = require('express').Router();
const {
  getUserId, getUsers, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUserId);
users.post('/', createUser);
users.patch('/me', updateUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };
