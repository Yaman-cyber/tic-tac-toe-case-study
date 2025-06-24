const Joi = require("joi");

const gamePlayer = require("../../enums/gamePlayer.enum");
const gameFirstMoveBy = require("../../enums/gameFirstMoveBy.enum");
const { ENGLISH } = require("../../enums/requestLanguage.enum");

const mapEnumsValues = require("../../helpers/mapEnumsValues");

module.exports = function (data, lang = ENGLISH) {
  let result = {};

  const schema = Joi.object({
    firstMoveBy: Joi.string()
      .valid(...mapEnumsValues(gameFirstMoveBy))
      .required(),

    aiPlayer: Joi.string().when("firstMoveBy", {
      is: gameFirstMoveBy.AI,
      then: Joi.string().valid(gamePlayer.X).required(),
      otherwise: Joi.string().valid(gamePlayer.O).required(),
    }),

    userPlayer: Joi.string().when("firstMoveBy", {
      is: gameFirstMoveBy.AI,
      then: Joi.string().valid(gamePlayer.O).required(),
      otherwise: Joi.string().valid(gamePlayer.X).required(),
    }),
  });

  result = schema.validate(data);

  if (result.error) return result;

  return result;
};
