const users = require('express').Router();
const {
  getUserId, getUsers, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUserId);
//users.post('/', createUser);
users.patch('/me', updateUser);
users.get('/me', getCurrentUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };
