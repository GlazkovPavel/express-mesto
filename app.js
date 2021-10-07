require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');
const wrong = require('./routes/wrong-requests');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHanding = require('./middlewares/error');
const { methodValidator } = require('./middlewares/methodValidator');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors')

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(methodValidator),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);
app.use('*', wrong);

app.use(errorLogger);

app.use(errors());

app.use(errorHanding);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
