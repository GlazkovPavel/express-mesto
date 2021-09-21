const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, deleteCard, dislikeCard, likeCard, postCard,
} = require('../controllers/cards');

cards.get('/', getCards);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), postCard);

cards.delete('/:cardId', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().length(24) }),
}), deleteCard);

cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), likeCard);

cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), dislikeCard);

module.exports = { cards };
