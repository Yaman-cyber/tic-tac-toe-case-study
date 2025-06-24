const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { Game } = require("../../models/game.model");

const gameStatus = require("../../enums/gameStatus.enum");
const gamePlayer = require("../../enums/gamePlayer.enum");
const { ENGLISH } = require("../../enums/requestLanguage.enum");

const messages = require("../../constants/messages.json");

module.exports = async function (data, lang = ENGLISH) {
  let result = {};
  const { userId, gameId } = data;

  const schema = Joi.object({
    gameId: Joi.objectId().required(),

    userId: Joi.objectId().required(),

    state: Joi.object({
      board: Joi.array()
        .items(Joi.array().items(Joi.number().valid(1, 0, -1)).length(3))
        .length(3)
        .required(),
    }).required(),

    move: Joi.object({
      row: Joi.number().min(0).max(2).required(),
      col: Joi.number().min(0).max(2).required(),
    }).required(),
  });

  result = schema.validate(data);

  if (result.error) return result;

  const game = await Game.findOne({ _id: gameId, user: userId, status: gameStatus.ACTIVE });

  if (!game) {
    result = { error: { details: [{ message: messages[lang].gameNotFoundOrEnded }] } };

    return result;
  }

  result.game = game;

  return result;
};
