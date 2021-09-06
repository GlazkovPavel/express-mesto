const users = require('express').Router();
const { getUserId, getUsers, createUser} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUserId)
users.post('/', createUser);

module.exports = {users};