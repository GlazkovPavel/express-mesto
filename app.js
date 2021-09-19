const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');
const wrong = require('./routes/wrong-requests');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '61377c2bd5a153b8acf4d18e',
//   };
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);
app.use('*', wrong);

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});
