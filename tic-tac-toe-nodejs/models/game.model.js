const mongoose = require("mongoose");

const gameFirstMoveBy = require("../enums/gameFirstMoveBy.enum");
const gamePlayer = require("../enums/gamePlayer.enum");
const gameStatus = require("../enums/gameStatus.enum");
const gameResult = require("../enums/gameResult.enum");

const mapEnumsValues = require("../helpers/mapEnumsValues");

const gameSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },

    firstMoveBy: { type: String, enum: mapEnumsValues(gameFirstMoveBy), required: true },

    lastMoveBy: { type: String, enum: mapEnumsValues(gamePlayer), default: null },

    aiPlayer: { type: String, enum: mapEnumsValues(gamePlayer), default: gamePlayer.X },

    userPlayer: { type: String, enum: mapEnumsValues(gamePlayer), default: gamePlayer.O },

    status: { type: String, enum: mapEnumsValues(gameStatus), default: gameStatus.ACTIVE, index: true },

    result: { type: String, enum: mapEnumsValues(gameResult), default: null, index: true },

    boardState: {
      type: [[Number]],
      default: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  },
  { timestamps: true }
);

gameSchema.index({ createdA: -1 });

gameSchema.plugin(require("mongoose-paginate-v2"));

const Game = mongoose.model("Game", gameSchema);

exports.Game = Game;
