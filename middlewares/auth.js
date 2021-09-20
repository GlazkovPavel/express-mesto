const jwt = require('jsonwebtoken');
const { NOT_AUTHORIZATION, FORBIDDEN } = require('../errors/errors');

const JWT_SECRET = 'some-secret-key'; // в конце убрать

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(NOT_AUTHORIZATION).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(FORBIDDEN).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
