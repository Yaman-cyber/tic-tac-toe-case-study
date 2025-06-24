const { Game } = require("../../../models/game.model");

const gameResult = require("../../../enums/gameResult.enum");

const messages = require("../../../constants/messages.json");
const responseCodes = require("../../../constants/responseCodes.json");

exports.getGamesStats = async (req, res, next) => {
  const { lang, user } = req;
  const filter = { user: user._id };

  const [total, won, lost, draw] = await Promise.all([
    Game.countDocuments(filter),
    Game.countDocuments({ ...filter, result: gameResult.WON }),
    Game.countDocuments({ ...filter, result: gameResult.LOST }),
    Game.countDocuments({ ...filter, result: gameResult.DRAW }),
  ]);

  res.code = responseCodes.success;
  res.data = { total, won, lost, draw };
  res.message = messages[lang].getSuccess;
  return next();
};
