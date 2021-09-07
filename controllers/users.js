const User = require('../models/user');

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if(!user){
        res.status(404).send({ message: "Запрашиваемый пользователь не найден"})
      }
       res.status(200).send({data: user})
    })
    .catch((err) => res.status(500).send(`Произошла ошибка: ${err.name} ${err.message}`))
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({data: users}))
    .catch((err) => res.status(500).send(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.status(201).send({data: user}))
    .catch((err) => {
      if(err.name || err.about || err.avatar === "ValidationError"){
        res.status(400).send({ message: "Произошла ошибка валидации"}
        )
      }
      res.status(500).send(`Произошла ошибка: ${err.name} ${err.message}`)
    });
};

module.exports.updateUser = (req, res) =>{
  User.findByIdAndUpdate(req.user._id, {name: req.body.name, about: req.body.about})
    .then(user => res.status(200).send({data: user}))
    .catch((err) => res.status(500).send(`Произошла ошибка: ${err.name} ${err.message}`));
}

module.exports.updateAvatar = (req, res) =>{
  User.findByIdAndUpdate(req.user._id, {name: req.body.avatar})
    .then(user => res.status(200).send({data: user}))
    .catch((err) => res.status(500).send(`Произошла ошибка: ${err.name} ${err.message}`));
}