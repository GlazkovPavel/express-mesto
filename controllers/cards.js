const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(err => res.status(500).send({err: err.message}))
};

module.exports.postCard = (req, res) => {
  const { name, link} = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
    .then(card => res.status(201).send({data: card}))
    .catch(err => res.status(500).send({err: err.message}))
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete(req.params.id)
    .then(card => res.status(200).send({data: card}))
    .catch(err => res.status(500).send({err: err.message}))
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id}}, { new: true })
    .then(card => res.status(200).send({data: card}))
    .catch(err => res.status(500).send({err: err.message}))
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => res.status(200).send({data: card}))
    .catch(err => res.status(500).send({err: err.message}))
};