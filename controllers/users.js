const { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR, BAD_REQUEST_ERROR } = require('../errors/errors');

const User = require('../models/user');

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      }
      res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`);
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      } return res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`);
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.avatar === 'ValidationError' || err.avatar === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      } return res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`);
    });
};
