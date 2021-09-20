const { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR, BAD_REQUEST_ERROR } = require('../errors/errors');

const Card = require('../models/card');
const bcrypt = require("bcrypt");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ err: err.message }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      }
      res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`);
    });
};

 module.exports.deleteCard = (req, res) => {
   Card.findById(req.params.cardId)
     .then((card) => {
      if (!card) {
       } else if (card.owner.toString() !== req.user._id) {
            res.status(403).send({ message: 'Нет прав, нельзя удалять карточки других пользователей' });
       }

      Card.findByIdAndDelete(req.params.cardId)
        .then((deletedCard) => res.send(deletedCard));
    })
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`));
 };

// module.exports.deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (card !== null) {
//         res.send({ data: card });
//       } else { res.status(NOT_FOUND_ERROR).send({ message: 'Данной карточки не существует' }); }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
//       } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
//     });
// };

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else { res.status(NOT_FOUND_ERROR).send({ message: 'Данной карточки не существует' }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId, { $pull: { likes: req.user._id } }, { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else { res.status(NOT_FOUND_ERROR).send({ message: 'Данной карточки не существует' }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка валидации' });
      } else { res.status(INTERNAL_SERVER_ERROR).send(`Произошла ошибка: ${err.name} ${err.message}`); }
    });
};
