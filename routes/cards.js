const cards = require('express').Router();
const { getCards, deleteCard, dislikeCard, likeCard, postCard} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', postCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = {cards};