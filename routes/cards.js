const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, deleteCard, dislikeCard, likeCard, postCard,
} = require('../controllers/cards');
const { methodValidator } = require('../middlewares/methodValidator');

cards.get('/', getCards);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(methodValidator),
  }),
}), postCard);

cards.delete('/:cardId', celebrate({
  params: Joi.object().keys(
    { cardId: Joi.string().required().length(24).hex() },
  ),
}), deleteCard);

cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

module.exports = { cards };
