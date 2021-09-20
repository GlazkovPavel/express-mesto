const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const {
  NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR, BAD_REQUEST_ERROR, EMAIL_CONFLICT,
} = require('../errors/errors');

const JWT_SECRET = 'some-secret-key'; // в конце убрать
const User = require('../models/user');


module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if(!user){
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации getCurrentUser' });
      } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
    });
}

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
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации getUserId' });
      } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`);
    }

    return User.findOne({ email })
      .then((user) => {
        if (!user) {
          return User.create({
            name, about, avatar, email, password: hash,
          })
            .then((u) => res.status(201).send({
              _id: u._id,
              name: u.name,
              about: u.about,
              avatar: u.avatar,
            }));
        }
        return res.status(EMAIL_CONFLICT).send({ message: 'Такой пользователь уже существует' });
      });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(NOT_FOUND_ERROR).send({ message: 'Неправильные почта или пароль' });
          }
          return user;
        });
    })
    .then((verifiedUser) => {
      const token = jwt.sign({ _id: verifiedUser._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`));
};
