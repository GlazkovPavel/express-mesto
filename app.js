const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');
const wrong = require('./routes/wrong-requests');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '61377c2bd5a153b8acf4d18e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);
app.use('*', wrong);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} поту`);
  console.log(BASE_PATH);
});
