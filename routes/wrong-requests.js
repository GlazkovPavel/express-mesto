const wrong = require('express').Router();
const { NOT_FOUND_ERROR } = require('../errors/errors');

wrong.use('*', (req, res) => res.status(NOT_FOUND_ERROR).send({ message: 'Ресурс не найден' }));

module.exports = wrong;
