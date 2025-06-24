const { Game } = require("../../../models/game.model");

const validate = require("../../../validators/game");

const pythonService = require("../../../services/python");

const gameStatus = require("../../../enums/gameStatus.enum");
const gameResult = require("../../../enums/gameResult.enum");

const messages = require("../../../constants/messages.json");
const responseCodes = require("../../../constants/responseCodes.json");

exports.startGame = async (req, res, next) => {
  const { lang, user, body } = req;
  const { firstMoveBy } = body;

  const { error } = validate.startGameValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  const game = await new Game({ user: user._id, ...body }).save();

  res.code = responseCodes.success;
  res.data = game;
  res.message = messages[lang].addSuccess;
  return next();
};

exports.playerMove = async (req, res, next) => {
  const { lang, user, body } = req;

  body.userId = user._id.toString();
  const { error, game } = await validate.playerMoveValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  body.state.current_player = game.userPlayer;
  const playerMoveResult = await pythonService.playerMoveService(body);

  if (!playerMoveResult.success) {
    res.code = responseCodes.badRequest;
    res.message = playerMoveResult.error || messages[lang].generalError;
    return next();
  }

  if (playerMoveResult.response.game_over) {
    game.status = gameStatus.ENDED;
    game.result = !playerMoveResult?.response?.winner ? gameResult.DRAW : playerMoveResult?.response?.winner === game.userPlayer ? gameResult.WON : gameResult.LOST;
  }

  game.boardState = playerMoveResult?.response.board;
  game.lastMoveBy = game.userPlayer;

  await game.save();

  res.code = responseCodes.success;
  res.data = game;
  res.message = game.status === gameStatus.ENDED ? messages[lang].gameOver : messages[lang].validMove;
  return next();
};

exports.aiMove = async (req, res, next) => {
  const { lang, user, body } = req;

  body.userId = user._id.toString();
  const { error, game } = await validate.aiMoveValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  body.current_player = game.aiPlayer;
  const playerMoveResult = await pythonService.aiMoveService(body);

  if (!playerMoveResult.success) {
    res.code = responseCodes.badRequest;
    res.message = playerMoveResult.error || messages[lang].generalError;
    return next();
  }

  if (playerMoveResult.response.game_over) {
    game.status = gameStatus.ENDED;
    game.result = !playerMoveResult?.response?.winner ? gameResult.DRAW : playerMoveResult?.response?.winner === game.userPlayer ? gameResult.WON : gameResult.LOST;
  }

  game.boardState = playerMoveResult?.response.board;
  game.lastMoveBy = game.aiPlayer;

  await game.save();

  res.code = responseCodes.success;
  res.data = game;
  res.message = game.status === gameStatus.ENDED ? messages[lang].gameOver : messages[lang].validMove;
  return next();
};

exports.getGames = async (req, res, next) => {
  const { lang, user, query } = req;
  const { pageSize, pageNumber, status } = query;

  const filter = { user: user._id };

  if (status) filter.status = status;

  const data = await Game.paginate(filter, { page: pageNumber, limit: pageSize, select: "-user -__v -updatedAt -boardState", sort: { createdAt: -1 } });

  res.code = responseCodes.success;
  res.data = data;
  res.message = messages[lang].getSuccess;
  return next();
};

exports.getById = async (req, res, next) => {
  const { lang, user, params } = req;
  const { id } = params;

  const filter = { user: user._id, _id: id };

  const data = await Game.findOne(filter).select("-user -__v -updatedAt");

  res.code = responseCodes.success;
  res.data = data;
  res.message = messages[lang].getSuccess;
  return next();
};
